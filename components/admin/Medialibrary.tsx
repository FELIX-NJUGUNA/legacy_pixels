"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch } from "../../lib/admin-api";
import { thumbUrl } from "../../lib/cloudinary-upload";

export type LibraryProject = {
  id: string;
  title: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  category_id: string | null;
  published: boolean;
  sort_order: number;
};
type Category = { id: string; name: string };

const btn =
  "border border-white/20 text-mist px-3 py-1.5 text-[11px] uppercase tracking-widest hover:border-white/50 transition-colors disabled:opacity-40";
const field =
  "bg-transparent border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#E8610A]";

export default function MediaLibrary({
  initialProjects,
  categories,
}: {
  initialProjects: LibraryProject[];
  categories: Category[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all"); // all | none | <id>
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragId, setDragId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // keep in sync after router.refresh()
  useEffect(() => setItems(initialProjects), [initialProjects]);

  const catName = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filtersActive = query.trim() !== "" || cat !== "all" || status !== "all";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (cat === "none" && p.category_id) return false;
      if (cat !== "all" && cat !== "none" && p.category_id !== cat) return false;
      if (status === "published" && !p.published) return false;
      if (status === "draft" && p.published) return false;
      return true;
    });
  }, [items, query, cat, status]);

  const publishedCount = items.filter((p) => p.published).length;

  function flash(type: "ok" | "err", text: string) {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  }
  const errText = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function setPublished(ids: string[], published: boolean) {
    const prev = items;
    setItems(items.map((p) => (ids.includes(p.id) ? { ...p, published } : p)));
    try {
      await Promise.all(
        ids.map((id) => adminFetch(`/api/admin/projects/${id}`, "PATCH", { published }))
      );
      flash("ok", `${ids.length} ${published ? "published" : "moved to draft"}`);
    } catch (e) {
      setItems(prev);
      flash("err", errText(e));
    }
  }

  async function moveToCategory(ids: string[], categoryId: string | null) {
    const prev = items;
    setItems(items.map((p) => (ids.includes(p.id) ? { ...p, category_id: categoryId } : p)));
    try {
      await Promise.all(
        ids.map((id) =>
          adminFetch(`/api/admin/projects/${id}`, "PATCH", { category_id: categoryId })
        )
      );
      flash("ok", `Moved ${ids.length} item${ids.length > 1 ? "s" : ""}`);
      setSelected(new Set());
    } catch (e) {
      setItems(prev);
      flash("err", errText(e));
    }
  }

  async function remove(ids: string[]) {
    const label = ids.length === 1 ? "this item" : `${ids.length} items`;
    if (!window.confirm(`Delete ${label}? The file is also removed from Cloudinary. This can't be undone.`))
      return;
    setBusy(true);
    try {
      await Promise.all(ids.map((id) => adminFetch(`/api/admin/projects/${id}`, "DELETE")));
      setItems((prev) => prev.filter((p) => !ids.includes(p.id)));
      setSelected(new Set());
      flash("ok", `Deleted ${ids.length}`);
    } catch (e) {
      flash("err", errText(e));
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  const canReorder = !filtersActive;

  async function dropOn(targetId: string) {
    if (!dragId || dragId === targetId || !canReorder) return;
    const prev = items;
    const from = items.findIndex((p) => p.id === dragId);
    const to = items.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next.map((p, i) => ({ ...p, sort_order: i })));
    setDragId(null);
    try {
      await adminFetch("/api/admin/projects/reorder", "POST", { ids: next.map((p) => p.id) });
      flash("ok", "Order saved");
    } catch (e) {
      setItems(prev);
      flash("err", errText(e));
    }
  }

  return (
    <div>
      {/* summary */}
      <p className="text-xs text-mist/60 mb-4">
        {items.length} items · {publishedCount} live · {items.length - publishedCount} draft
      </p>

      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title…"
          className={`${field} w-full sm:w-64`}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={field}>
          <option value="all" className="bg-[#060608]">All categories</option>
          <option value="none" className="bg-[#060608]">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#060608]">{c.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className={field}
        >
          <option value="all" className="bg-[#060608]">Live + draft</option>
          <option value="published" className="bg-[#060608]">Live only</option>
          <option value="draft" className="bg-[#060608]">Drafts only</option>
        </select>
        <button
          className={btn}
          onClick={() =>
            setSelected(
              selected.size === visible.length ? new Set() : new Set(visible.map((p) => p.id))
            )
          }
        >
          {selected.size && selected.size === visible.length ? "Clear" : "Select all"}
        </button>
      </div>

      {canReorder && items.length > 1 && (
        <p className="text-[11px] text-mist/40 mb-4">
          Drag cards to reorder — the order is what visitors see on your site.
        </p>
      )}

      {/* bulk bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 bg-[#0d0d12] border border-[#E8610A]/40 p-3 mb-4">
          <span className="text-xs">{selected.size} selected</span>
          <button className={btn} disabled={busy} onClick={() => setPublished([...selected], true)}>
            Publish
          </button>
          <button className={btn} disabled={busy} onClick={() => setPublished([...selected], false)}>
            Unpublish
          </button>
          <select
            className={`${field} !py-1.5 text-xs`}
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              moveToCategory([...selected], v === "none" ? null : v);
              e.target.value = "";
            }}
          >
            <option value="" className="bg-[#060608]">Move to category…</option>
            <option value="none" className="bg-[#060608]">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#060608]">{c.name}</option>
            ))}
          </select>
          <button
            className={`${btn} !border-red-400/50 !text-red-400`}
            disabled={busy}
            onClick={() => remove([...selected])}
          >
            Delete
          </button>
        </div>
      )}

      {notice && (
        <p className={`text-sm mb-4 ${notice.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
          {notice.text}
        </p>
      )}

      {/* grid */}
      {visible.length === 0 ? (
        <p className="text-mist/50 text-sm py-12">
          {items.length === 0 ? (
            <>
              Nothing here yet.{" "}
              <Link href="/admin/projects/bulk" className="text-[#E8610A] underline">
                Bulk upload your first images
              </Link>
              .
            </>
          ) : (
            "No items match these filters."
          )}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {visible.map((p) => {
            const isSel = selected.has(p.id);
            const src =
              p.media_type === "video"
                ? thumbUrl(p.media_url, "video")
                : thumbUrl(p.media_url, "image");
            return (
              <div
                key={p.id}
                draggable={canReorder}
                onDragStart={() => setDragId(p.id)}
                onDragEnd={() => setDragId(null)}
                onDragOver={(e) => canReorder && e.preventDefault()}
                onDrop={() => dropOn(p.id)}
                className={`group border ${
                  isSel ? "border-[#E8610A]" : "border-white/10"
                } ${dragId === p.id ? "opacity-40" : ""} ${canReorder ? "cursor-grab" : ""}`}
              >
                <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={p.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute top-2 left-2 bg-black/60 p-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleSelect(p.id)}
                      className="accent-[#E8610A]"
                    />
                  </label>
                  {p.media_type === "video" && (
                    <span className="absolute top-2 right-2 bg-black/70 text-[10px] uppercase tracking-widest px-2 py-1">
                      Video
                    </span>
                  )}
                  {!p.published && (
                    <span className="absolute bottom-2 left-2 bg-[#E8610A] text-[#060608] text-[10px] uppercase tracking-widest px-2 py-1">
                      Draft
                    </span>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div>
                    <p className="text-sm truncate" title={p.title}>{p.title}</p>
                    <p className="text-[11px] text-mist/50 truncate">
                      {(p.category_id && catName.get(p.category_id)) || "Uncategorized"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                    <button
                      onClick={() => setPublished([p.id], !p.published)}
                      className={p.published ? "text-emerald-400" : "text-mist/60"}
                    >
                      {p.published ? "● Live" : "○ Draft"}
                    </button>
                    <span className="flex gap-3">
                      <Link href={`/admin/projects/${p.id}/edit`} className="text-mist hover:text-[#E8610A]">
                        Edit
                      </Link>
                      <button
                        onClick={() => remove([p.id])}
                        className="text-red-400/70 hover:text-red-400"
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}