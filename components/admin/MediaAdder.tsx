"use client";

import { useRef, useState } from "react";
import { importFromUrl, uploadToCloudinary, type UploadResult } from "@/lib/cloudinary-upload";

const input =
  "w-full bg-transparent border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#E8610A]";
const btn =
  "border border-[#E8610A] text-[#E8610A] px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-40";

type Task = { name: string; go: (cb: (p: number) => void) => Promise<UploadResult> };

/** Upload files OR paste Google Drive / Cloudinary / image links. Returns Cloudinary results. */
export default function MediaAdder({
  onAdded,
  multiple = true,
  label = "Add images",
}: {
  onAdded: (results: UploadResult[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [links, setLinks] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run(tasks: Task[]) {
    setBusy(true);
    setError(null);
    const ok: UploadResult[] = [];
    const errs: string[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const prefix = `${i + 1}/${tasks.length} · ${t.name}`;
      setStatus(prefix);
      try {
        ok.push(await t.go((p) => setStatus(`${prefix} ${p}%`)));
      } catch (e) {
        errs.push(`${t.name}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }
    if (ok.length) onAdded(ok);
    if (errs.length) setError(errs.join("\n"));
    else setLinks("");
    setBusy(false);
    setStatus("");
  }

  function onFiles(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list).filter((f) => /^(image|video)\//.test(f.type));
    const picked = multiple ? files : files.slice(0, 1);
    run(picked.map((f) => ({ name: f.name, go: (cb) => uploadToCloudinary(f, cb) })));
  }

  function onLinks() {
    const all = links.split(/\s+/).filter(Boolean);
    const picked = multiple ? all : all.slice(0, 1);
    if (!picked.length) return;
    run(picked.map((u) => ({ name: u.length > 40 ? u.slice(0, 37) + "…" : u, go: (cb) => importFromUrl(u, cb) })));
  }

  return (
    <div className="space-y-3 border border-white/10 p-4">
      <p className="text-[11px] uppercase tracking-widest text-mist/60">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btn} disabled={busy} onClick={() => fileRef.current?.click()}>
          Upload from computer
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <div className="flex gap-3 items-start">
        <textarea
          rows={2}
          className={`${input} resize-none`}
          placeholder={
            multiple
              ? "…or paste Google Drive / Cloudinary / image links (one per line)"
              : "…or paste a Google Drive / Cloudinary / image link"
          }
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          disabled={busy}
        />
        <button type="button" className={btn} disabled={busy || !links.trim()} onClick={onLinks}>
          Add link
        </button>
      </div>
      {busy && <p className="text-xs text-mist/70">{status || "Working…"}</p>}
      {error && <p className="text-xs text-red-400 whitespace-pre-line">{error}</p>}
    </div>
  );
}
