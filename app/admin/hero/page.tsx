import AdminHeader from "../../../components/admin/AdminHeader";
import HeroEditor from "@/components/admin/HeroEditor";
import { getHeroConfig } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  const config = await getHeroConfig();
  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f0ea] px-6 md:px-12 py-12">
      <AdminHeader title="Hero Section" />
      <HeroEditor initial={config} />
    </div>
  );
}
