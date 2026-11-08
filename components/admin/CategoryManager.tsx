"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "./../../lib/admin-api";

type Category = { id: string; name: string; slug: string };

const input =
  "bg-transparent border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#E8610A]";
const btn =
  "border border-white/20 text-mist px-3 py-2 text-[11px] uppercase tracking-widest hover:border-white/50 transition-colors disabled:opacity-40";

export default function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [cats, setCats] = useState(initial);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errText = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const created = await adminFetch<Category>("/api/admin/categories", "POST", { name });
      setCats((prev) => [...prev, created]);
      setName("");
      router.refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  async function rename(id: string) {
    if (!editName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await adminFetch<Category>(`/api/admin/categories/${id}`, "PUT", { name: editName });
      setCats((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(c: Category) {
    if (!window.confirm(`Delete "${c.name}"? Its items will become Uncategorized (they are not deleted).`)) return;
    setBusy(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/categories/${c.id}`, "DELETE");
      setCats((prev) => prev.filter((x) => x.id !== c.id));
      router.refresh();
    } catch (err) {
      setError(errText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={add} className="flex gap-3">
        <input className={`${input} flex-1`} placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="border border-[#E8610A] text-[#E8610A] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <ul className="divide-y divide-white/10 border border-white/10">
        {cats.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-3">
            {editingId === c.id ? (
              <>
                <input
                  autoFocus
                  className={`${input} flex-1`}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") rename(c.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button className={btn} disabled={busy} onClick={() => rename(c.id)}>Save</button>
                <button className={btn} onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-sm">{c.name}</p>
                  <p className="text-[11px] text-mist/40">/{c.slug}</p>
                </div>
                <button
                  className={btn}
                  onClick={() => {
                    setEditingId(c.id);
                    setEditName(c.name);
                  }}
                >
                  Rename
                </button>
                <button className={`${btn} !border-red-400/40 !text-red-400`} disabled={busy} onClick={() => remove(c)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
        {cats.length === 0 && <li className="p-4 text-sm text-mist/50">No categories yet.</li>}
      </ul>
    </div>
  );
}