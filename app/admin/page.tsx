import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase/server";
import AdminHeader from "../../components/admin/AdminHeader";
import MediaLibrary, { type LibraryProject } from "../../components/admin/Medialibrary";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createAdminSupabase();

  const [{ data: projects, error }, { data: categories }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, media_type, media_url, thumbnail_url, category_id, published, sort_order")
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <AdminHeader title="Studio Admin" />

      <div className="flex flex-wrap gap-4 mb-10">
        <Link
          href="/admin/projects/bulk"
          className="border border-[#E8610A] text-[#E8610A] px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors"
        >
          + Bulk upload
        </Link>
        <Link
          href="/admin/projects/new"
          className="border border-white/20 text-mist px-5 py-2 text-xs uppercase tracking-widest hover:border-white/50 transition-colors"
        >
          + Single upload
        </Link>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-6">
          Couldn&apos;t load projects: {error.message}
        </p>
      )}

      <MediaLibrary
        initialProjects={(projects ?? []) as LibraryProject[]}
        categories={categories ?? []}
      />
    </div>
  );
}
