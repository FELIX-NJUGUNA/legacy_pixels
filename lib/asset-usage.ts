// SERVER ONLY — stops us deleting a Cloudinary file that another project or the hero still uses.
export async function assetInUse(supabase: any, publicId: string, excludeProjectId?: string) {
  let q = supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("cloudinary_public_id", publicId);
  if (excludeProjectId) q = q.neq("id", excludeProjectId);
  const { count } = await q;
  if ((count ?? 0) > 0) return true;

  const { data: hero } = await supabase.from("site_settings").select("value").eq("key", "hero").maybeSingle();
  if (!hero?.value) return false;
  const blob = JSON.stringify(hero.value);
  return blob.includes(publicId) || blob.includes(encodeURI(publicId));
}
