"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton, {
  type CloudinaryUploadResult,
} from "./CloudinaryUploadButton";

type Category = { id: string; name: string };

export type ProjectFormValues = {
  id?: string;
  title: string;
  category_id: string;
  year: string;
  aspect: "portrait" | "landscape" | "square";
  tags: string;
  published: boolean;
  media_url?: string;
  media_type?: "image" | "video";
  cloudinary_public_id?: string;
  thumbnail_url?: string;
};

export default function ProjectForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProjectFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<ProjectFormValues>(
    initial ?? {
      title: "",
      category_id: categories[0]?.id ?? "",
      year: String(new Date().getFullYear()),
      aspect: "landscape",
      tags: "",
      published: true,
    }
  );
  const [upload, setUpload] = useState<CloudinaryUploadResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleUploaded(result: CloudinaryUploadResult) {
    setUpload(result);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEdit && !upload) {
      setError("Please upload a photo or video first.");
      return;
    }

    const payload = {
      title: values.title,
      category_id: values.category_id || null,
      year: values.year,
      aspect: values.aspect,
      tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: values.published,
      ...(upload
        ? {
            media_url: upload.secure_url,
            media_type: upload.resource_type,
            cloudinary_public_id: upload.public_id,
          }
        : {}),
    };

    setSaving(true);
    const res = await fetch(
      isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-widest text-mist mb-2">
          Media
        </label>
        <CloudinaryUploadButton onUploaded={handleUploaded} />
        {isEdit && !upload && (
          <p className="text-xs text-mist/50 mt-2">
            Leave as-is to keep the current media, or upload a replacement.
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-mist mb-2">Title</label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-mist mb-2">
            Category
          </label>
          <select
            value={values.category_id}
            onChange={(e) => setValues({ ...values, category_id: e.target.value })}
            className="w-full bg-[#060608] border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-mist mb-2">Year</label>
          <input
            value={values.year}
            onChange={(e) => setValues({ ...values, year: e.target.value })}
            className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-mist mb-2">
            Aspect
          </label>
          <select
            value={values.aspect}
            onChange={(e) =>
              setValues({ ...values, aspect: e.target.value as ProjectFormValues["aspect"] })
            }
            className="w-full bg-[#060608] border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div className="flex items-end gap-2 pb-3">
          <input
            id="published"
            type="checkbox"
            checked={values.published}
            onChange={(e) => setValues({ ...values, published: e.target.checked })}
          />
          <label htmlFor="published" className="text-sm text-mist">
            Published (visible on site)
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-mist mb-2">
          Tags (comma separated)
        </label>
        <input
          value={values.tags}
          onChange={(e) => setValues({ ...values, tags: e.target.value })}
          placeholder="Nairobi, Natural Light"
          className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="border border-[#E8610A] text-[#E8610A] px-6 py-3 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-50"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Publish project"}
      </button>
    </form>
  );
}
