import { notFound } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminSupabase();

  const [{ data: project }, { data: categories }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
  ]);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <AdminHeader title="Edit Project" />
      <ProjectForm
        categories={categories ?? []}
        initial={{
          id: project.id,
          title: project.title,
          category_id: project.category_id ?? "",
          year: project.year ?? "",
          aspect: project.aspect ?? "landscape",
          tags: (project.tags ?? []).join(", "),
          published: project.published,
          media_url: project.media_url,
          media_type: project.media_type,
        }}
      />
    </div>
  );
}
