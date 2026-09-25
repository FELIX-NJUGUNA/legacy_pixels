import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*, categories(name)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.title || !body.media_url || !body.cloudinary_public_id) {
    return NextResponse.json(
      { error: "title, media_url and cloudinary_public_id are required" },
      { status: 400 }
    );
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: body.title,
      category_id: body.category_id || null,
      year: body.year,
      media_type: body.media_type ?? "image",
      media_url: body.media_url,
      thumbnail_url: body.thumbnail_url ?? null,
      cloudinary_public_id: body.cloudinary_public_id,
      aspect: body.aspect ?? "landscape",
      tags: body.tags ?? [],
      published: body.published ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
