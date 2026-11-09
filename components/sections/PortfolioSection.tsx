import Portfolio from "./Portfolio";
import { projects as staticProjects } from "@/lib/portfolio-data";
import { getPublicProjects, getPublicCategoryNames } from "@/lib/site-data";

export default async function PortfolioSection({
  variant = "home",
}: {
  variant?: "home" | "full";
}) {
  const projects = await getPublicProjects(staticProjects);
  const order = await getPublicCategoryNames();

  const used = new Set<string>(projects.map((p) => p.category));
  const categories = [
    ...order.filter((n) => used.has(n)),
    ...Array.from(used).filter((n) => !order.includes(n)),
  ];

  return <Portfolio projects={projects} categories={categories} variant={variant} />;
}