"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; slug: string };

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to add category.");
      return;
    }
    setName("");
    router.refresh();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category? Projects in it become uncategorized.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete category.");
  }

  return (
    <div className="max-w-md space-y-8">
      <form onSubmit={addCategory} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
          className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-sm focus:border-[#E8610A] outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="border border-[#E8610A] text-[#E8610A] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="space-y-2">
        {initial.map((c) => (
          <div key={c.id} className="flex items-center justify-between border border-white/10 px-4 py-3">
            <span className="text-sm">{c.name}</span>
            <button
              onClick={() => deleteCategory(c.id)}
              className="text-xs uppercase tracking-widest text-mist hover:text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
