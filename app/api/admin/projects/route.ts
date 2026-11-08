import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { revalidateSite } from "@/lib/revalidate";

export async function GET() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*, categories(name)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Accepts a single project object OR an array (bulk upload).
export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: any[] = Array.isArray(body) ? body : [body];

  for (const b of items) {
    if (!b.title || !b.media_url || !b.cloudinary_public_id) {
      return NextResponse.json(
        { error: "title, media_url and cloudinary_public_id are required" },
        { status: 400 }
      );
    }
  }

  const supabase = createAdminSupabase();

  // new items go to the end of the list
  const { data: last } = await supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  let next = (last?.[0]?.sort_order ?? -1) + 1;

  const rows = items.map((b) => ({
    title: b.title,
    category_id: b.category_id || null,
    year: b.year || null,
    media_type: b.media_type ?? "image",
    media_url: b.media_url,
    thumbnail_url: b.thumbnail_url ?? null,
    cloudinary_public_id: b.cloudinary_public_id,
    aspect: b.aspect ?? "landscape",
    tags: b.tags ?? [],
    published: b.published ?? true,
    sort_order: next++,
  }));

  const { data, error } = await supabase.from("projects").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateSite();
  return NextResponse.json(Array.isArray(body) ? data : data![0], { status: 201 });
}
