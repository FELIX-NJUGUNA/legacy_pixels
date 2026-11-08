// SERVER ONLY — what the PUBLIC site reads from Supabase (with safe fallbacks).
import { createAdminSupabase } from "@/lib/supabase/server";
import { DEFAULT_HERO, sanitizeHero, type HeroConfig } from "@/lib/hero-defaults";

export async function getHeroConfig(): Promise<HeroConfig> {
  try {
    const supabase = createAdminSupabase();
    const { data } = await supabase.from("site_settings").select("value").eq("key", "hero").maybeSingle();
    return data?.value ? sanitizeHero(data.value) : DEFAULT_HERO;
  } catch {
    return DEFAULT_HERO;
  }
}

export type PublicProject = {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  aspect: "portrait" | "landscape" | "square";
  tags: string[];
};

/**
 * Portfolio items for the public site, same shape as your data.ts `Project`.
 * Pass your static `projects` array as the fallback so the site never goes blank.
 *   const projects = await getPublicProjects(staticProjects);
 */
export async function getPublicProjects<T = PublicProject>(fallback: T[] = []): Promise<T[]> {
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, year, media_type, media_url, thumbnail_url, aspect, tags, sort_order, categories(name)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) return fallback;

    return data.map((p: any) => ({
      id: String(p.id),
      title: p.title,
      category: (Array.isArray(p.categories) ? p.categories[0]?.name : p.categories?.name) ?? "Uncategorized",
      year: String(p.year ?? ""),
      image: p.media_type === "video" ? p.thumbnail_url ?? p.media_url : p.media_url,
      aspect: p.aspect ?? "landscape",
      tags: p.tags ?? [],
    })) as unknown as T[];
  } catch {
    return fallback;
  }
}

/** Category names in admin order, for the portfolio filter bar. */
export async function getPublicCategoryNames(fallback: string[] = []): Promise<string[]> {
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.from("categories").select("name").order("sort_order", { ascending: true });
    if (error || !data?.length) return fallback;
    return data.map((c: any) => c.name);
  } catch {
    return fallback;
  }
}
