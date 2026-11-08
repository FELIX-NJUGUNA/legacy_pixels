import { createAdminSupabase } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = createAdminSupabase();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <AdminHeader title="Categories" />
      <CategoryManager initial={categories ?? []} />
    </div>
  );
}
