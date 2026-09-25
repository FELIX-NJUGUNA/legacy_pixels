import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminSupabase();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, media_type, media_url, category_id, published, sort_order, categories(name)")
    .order("sort_order", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl" style={{ fontFamily: "Georgia, serif" }}>
          Studio Admin
        </h1>
        <SignOutButton />
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <Link
          href="/admin/projects/new"
          className="border border-[#E8610A] text-[#E8610A] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors"
        >
          + New project
        </Link>
        <Link
          href="/admin/categories"
          className="border border-white/20 text-mist px-5 py-2 text-xs uppercase tracking-widest hover:border-white/50 transition-colors"
        >
          Manage categories ({categories?.length ?? 0})
        </Link>
      </div>

      <div className="grid gap-3">
        {projects?.map((p: any) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border border-white/10 p-3"
          >
            {p.media_type === "video" ? (
              <video src={p.media_url} className="w-20 h-14 object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.media_url} alt={p.title} className="w-20 h-14 object-cover" />
            )}
            <div className="flex-1">
              <p className="text-sm">{p.title}</p>
              <p className="text-xs text-mist/50">
                {p.categories?.name ?? "Uncategorized"} · {p.media_type}
                {!p.published && " · draft"}
              </p>
            </div>
            <Link
              href={`/admin/projects/${p.id}/edit`}
              className="text-xs uppercase tracking-widest text-mist hover:text-[#E8610A]"
            >
              Edit
            </Link>
            <DeleteProjectButton id={p.id} />
          </div>
        ))}
        {!projects?.length && (
          <p className="text-mist/50 text-sm">No projects yet — add your first one.</p>
        )}
      </div>
    </div>
  );
}
