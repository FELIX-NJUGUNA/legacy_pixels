"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";
import {
  importFromUrl,
  titleFromFilename,
  titleFromLink,
  uploadToCloudinary,
} from "@/lib/cloudinary-upload";

type Category = { id: string; name: string };
type Status = "queued" | "uploading" | "saving" | "done" | "error";
type Item = {
  id: string;
  file?: File;
  link?: string;
  title: string;
  status: Status;
  progress: number;
  error?: string;
};

const input =
  "bg-transparent border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#E8610A]";
const CONCURRENCY = 3;
const uid = () => Math.random().toString(36).slice(2, 10);

export default function BulkUploader({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const saveChain = useRef<Promise<unknown>>(Promise.resolve());

  const [items, setItems] = useState<Item[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [published, setPublished] = useState(true);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [links, setLinks] = useState("");

  function addFiles(list: FileList | File[]) {
    const accepted = Array.from(list).filter((f) => /^(image|video)\//.test(f.type));
    setItems((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        id: uid(),
        file,
        title: titleFromFilename(file.name),
        status: "queued" as Status,
        progress: 0,
      })),
    ]);
  }

  function addLinks() {
    const urls = links.split(/\s+/).filter(Boolean);
    if (!urls.length) return;
    setItems((prev) => [
      ...prev,
      ...urls.map((link) => ({
        id: uid(),
        link,
        title: titleFromLink(link),
        status: "queued" as Status,
        progress: 0,
      })),
    ]);
    setLinks("");
  }

  function patch(id: string, p: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  }

  // DB inserts are serialized so sort_order stays consistent
  function save(payload: unknown) {
    const p = saveChain.current.then(() => adminFetch("/api/admin/projects", "POST", payload));
    saveChain.current = p.catch(() => {});
    return p;
  }

  async function processOne(item: Item) {
    patch(item.id, { status: "uploading", progress: 0, error: undefined });
    try {
      const onProg = (pct: number) => patch(item.id, { progress: pct });
      const media = item.file
        ? await uploadToCloudinary(item.file, onProg)
        : await importFromUrl(item.link!, onProg);
      patch(item.id, { status: "saving", progress: 100 });
      await save({
        title: item.title.trim() || "Untitled",
        category_id: categoryId || null,
        year: year || null,
        published,
        ...media,
      });
      patch(item.id, { status: "done" });
    } catch (e) {
      patch(item.id, { status: "error", error: e instanceof Error ? e.message : "Failed" });
    }
  }

  async function start() {
    const queue = items.filter((i) => i.status === "queued" || i.status === "error");
    if (!queue.length) return;
    setRunning(true);
    let idx = 0;
    const worker = async () => {
      while (idx < queue.length) await processOne(queue[idx++]);
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
    setRunning(false);
    router.refresh();
  }

  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "error").length;
  const pending = items.filter((i) => i.status === "queued" || i.status === "error").length;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <select className={input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={running}>
          <option value="" className="bg-[#060608]">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#060608]">{c.name}</option>
          ))}
        </select>
        <input className={`${input} w-24`} value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" disabled={running} />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-[#E8610A]" checked={published} onChange={(e) => setPublished(e.target.checked)} disabled={running} />
          Publish immediately
        </label>
      </div>

      <div
        onClick={() => fileInput.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`cursor-pointer border border-dashed text-center py-12 text-sm text-mist/60 transition-colors ${
          dragging ? "border-[#E8610A] bg-[#E8610A]/5" : "border-white/20"
        }`}
      >
        Drop many images/videos here, or click to select
      </div>
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* links */}
      <div className="space-y-2">
        <textarea
          rows={3}
          className={`${input} w-full resize-y`}
          placeholder={"Or paste links — one per line:\nGoogle Drive file links, Cloudinary links, or any direct image URL"}
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          disabled={running}
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={addLinks}
            disabled={running || !links.trim()}
            className="border border-white/20 text-mist px-4 py-2 text-[11px] uppercase tracking-widest hover:border-white/50 transition-colors disabled:opacity-40"
          >
            Add links to queue
          </button>
          <p className="text-[11px] text-mist/40">
            Drive files must be shared as &quot;Anyone with the link&quot;. Folder links aren&apos;t supported.
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <ul className="divide-y divide-white/10 border border-white/10">
            {items.map((i) => (
              <li key={i.id} className="p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    className={`${input} flex-1 min-w-0`}
                    value={i.title}
                    disabled={i.status !== "queued" && i.status !== "error"}
                    onChange={(e) => patch(i.id, { title: e.target.value })}
                  />
                  <span
                    className={`text-[11px] uppercase tracking-widest w-20 text-right ${
                      i.status === "done" ? "text-emerald-400" : i.status === "error" ? "text-red-400" : "text-mist/60"
                    }`}
                  >
                    {i.status === "uploading" ? `${i.progress}%` : i.status}
                  </span>
                  {!running && i.status !== "done" && (
                    <button
                      onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
                      className="text-mist/50 hover:text-red-400 text-lg leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  )}
                </div>
                {(i.status === "uploading" || i.status === "saving") && (
                  <div className="h-0.5 bg-white/10">
                    <div className="h-0.5 bg-[#E8610A] transition-all" style={{ width: `${i.progress}%` }} />
                  </div>
                )}
                {i.error && <p className="text-xs text-red-400">{i.error}</p>}
                <p className="text-[11px] text-mist/40 truncate">
                  {i.file ? `${i.file.name} · ${(i.file.size / 1024 / 1024).toFixed(1)} MB` : `🔗 ${i.link}`}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={start}
              disabled={running || pending === 0}
              className="border border-[#E8610A] text-[#E8610A] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-50"
            >
              {running ? "Working…" : failed ? `Retry / start ${pending}` : `Start ${pending} item${pending === 1 ? "" : "s"}`}
            </button>
            <span className="text-xs text-mist/60">
              {done} done{failed ? ` · ${failed} failed` : ""}
            </span>
            {done > 0 && !running && (
              <Link href="/admin" className="text-xs uppercase tracking-widest text-[#E8610A] underline">
                Go to portfolio →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
