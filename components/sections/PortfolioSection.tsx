import Portfolio from "./Portfolio";
import { projects as staticProjects } from "@/lib/portfolio-data";
import { getPublicProjects, getPublicCategoryNames } from "@/lib/site-data";

// Server component: reads published projects from Supabase.
// Falls back to portfolio-data.ts only if the database can't be read or is empty.
export default async function PortfolioSection() {
  const projects = await getPublicProjects(staticProjects);
  const order = await getPublicCategoryNames();

  // filter bar: only categories that actually have published items, in admin order
  const used = new Set<string>(projects.map((p) => p.category));
  const categories = [
    ...order.filter((n) => used.has(n)),
    ...Array.from(used).filter((n) => !order.includes(n)),
  ];

  return <Portfolio projects={projects} categories={categories} />;
}