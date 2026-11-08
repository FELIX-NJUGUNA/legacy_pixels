import { createAdminSupabase } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import BulkUploader from "@/components/admin/BulkUploader";

export const dynamic = "force-dynamic";

export default async function BulkUploadPage() {
  const supabase = createAdminSupabase();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <AdminHeader title="Bulk Upload" />
      <BulkUploader categories={categories ?? []} />
    </div>
  );
}
