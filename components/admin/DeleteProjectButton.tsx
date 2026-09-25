"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this project? This also removes it from Cloudinary.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Failed to delete project.");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs uppercase tracking-widest text-mist hover:text-red-400 disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
