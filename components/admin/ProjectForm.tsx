"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";
import {
  importFromUrl,
  parseCloudinaryUrl,
  thumbUrl,
  titleFromFilename,
  titleFromLink,
  uploadToCloudinary,
  type UploadResult,
} from "@/lib/cloudinary-upload";

type Category = { id: string; name: string };
type Initial = {
  id: string;
  title: string;
  category_id: string;
  year: string | number;
  aspect: string;
  tags: string;
  published: boolean;
  media_url?: string;
  media_type?: "image" | "video";
};

const input =
  "w-full bg-transparent border border-white/20 px-4 py-3 text-sm outline-none focus:border-[#E8610A]";
const label = "block text-[11px] uppercase tracking-widest text-mist/60 mb-2";

export default function ProjectForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const router = useRouter();
  const isEdit = !!initial;
  const fileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [aspect, setAspect] = useState(initial?.aspect ?? "auto");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);

  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    if (!/^(image|video)\//.test(f.type)) {
      setError("Please choose an image or video file.");
      return;
    }
    setError(null);
    setFile(f);
    setLink("");
    if (!title.trim()) setTitle(titleFromFilename(f.name));
    if (isEdit) setAspect("auto");
  }

  function onLinkChange(v: string) {
    setLink(v);
    if (v.trim()) setFile(null);
    if (v.trim() && !title.trim()) setTitle(titleFromLink(v.trim()));
    if (isEdit && v.trim()) setAspect("auto");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (!isEdit && !file && !link.trim()) return setError("Choose a file or paste a link.");

    setSaving(true);
    try {
      let media: UploadResult | null = null;
      if (file) {
        setStage("Uploading to Cloudinary…");
        setProgress(0);
        media = await uploadToCloudinary(file, setProgress);
      } else if (link.trim()) {
        setStage("Importing link…");
        setProgress(0);
        media = await importFromUrl(link, setProgress);
      }

      setStage("Saving…");
      const payload = {
        title: title.trim(),
        category_id: categoryId || null,
        year: year || null,
        aspect: aspect === "auto" ? media?.aspect ?? initial?.aspect ?? "landscape" : aspect,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        published,
        ...(media ?? {}),
      };

      if (isEdit) await adminFetch(`/api/admin/projects/${initial!.id}`, "PUT", payload);
      else await adminFetch("/api/admin/projects", "POST", payload);

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  const existingType = initial?.media_type;
  const linkIsCloudinary = !!link.trim() && !!parseCloudinaryUrl(link);
  const showExisting = !file && !linkIsCloudinary && initial?.media_url;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <span className={label}>{isEdit ? "Media (leave empty to keep current)" : "Media"}</span>
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
            pickFile(e.dataTransfer.files?.[0]);
          }}
          className={`cursor-pointer border border-dashed ${
            dragging ? "border-[#E8610A] bg-[#E8610A]/5" : "border-white/20"
          } p-4 text-center transition-colors`}
        >
          {preview && file ? (
            file.type.startsWith("video/") ? (
              <video src={preview} controls className="mx-auto max-h-80" onClick={(e) => e.stopPropagation()} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="mx-auto max-h-80 object-contain" />
            )
          ) : linkIsCloudinary ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbUrl(link.trim(), "image", 1000)} alt="Link preview" className="mx-auto max-h-80 object-contain" />
          ) : showExisting ? (
            existingType === "video" ? (
              <video src={initial!.media_url} controls className="mx-auto max-h-80" onClick={(e) => e.stopPropagation()} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbUrl(initial!.media_url!, "image", 1000)} alt={title} className="mx-auto max-h-80 object-contain" />
            )
          ) : (
            <p className="text-sm text-mist/60 py-10">Drop an image or video here, or click to browse</p>
          )}
          {file && (
            <p className="text-[11px] text-mist/50 mt-3">
              {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB — click to change
            </p>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />

        <div className="mt-3">
          <input
            className={input}
            value={link}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="…or paste a Google Drive / Cloudinary / image link"
          />
          <p className="text-[11px] text-mist/40 mt-1.5">
            Drive files must be shared as &quot;Anyone with the link&quot;. Cloudinary links are used as-is; Drive and other links are copied into your Cloudinary.
          </p>
        </div>
      </div>

      <div>
        <label className={label}>Title</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className={label}>Category</label>
          <select className={input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="" className="bg-[#060608]">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#060608]">{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Year</label>
          <input className={input} value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <label className={label}>Aspect</label>
          <select className={input} value={aspect} onChange={(e) => setAspect(e.target.value)}>
            <option value="auto" className="bg-[#060608]">Auto-detect from file</option>
            <option value="landscape" className="bg-[#060608]">Landscape</option>
            <option value="portrait" className="bg-[#060608]">Portrait</option>
            <option value="square" className="bg-[#060608]">Square</option>
          </select>
        </div>
        <div>
          <label className={label}>Tags (comma separated)</label>
          <input className={input} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="wedding, outdoor, golden hour" />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#E8610A]" />
        Published (visible on the site)
      </label>

      {saving && (
        <div>
          <p className="text-xs text-mist/70 mb-2">
            {stage} {stage.startsWith("Uploading") && `${progress}%`}
          </p>
          <div className="h-1 bg-white/10">
            <div className="h-1 bg-[#E8610A] transition-all" style={{ width: `${stage.startsWith("Uploading") ? progress : 100}%` }} />
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="border border-[#E8610A] text-[#E8610A] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-50"
        >
          {saving ? "Working…" : isEdit ? "Save changes" : "Upload & save"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => router.push("/admin")}
          className="border border-white/20 text-mist px-6 py-3 text-xs uppercase tracking-widest hover:border-white/50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
