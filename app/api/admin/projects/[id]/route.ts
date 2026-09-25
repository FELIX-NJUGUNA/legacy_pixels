import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createAdminSupabase();

  const update: Record<string, unknown> = {
    title: body.title,
    category_id: body.category_id || null,
    year: body.year,
    aspect: body.aspect,
    tags: body.tags ?? [],
    published: body.published,
  };

  // only touch media fields if a new upload was provided
  if (body.media_url) {
    update.media_url = body.media_url;
    update.media_type = body.media_type;
    update.cloudinary_public_id = body.cloudinary_public_id;
    update.thumbnail_url = body.thumbnail_url ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabase();

  const { data: project } = await supabase
    .from("projects")
    .select("cloudinary_public_id, media_type")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (project?.cloudinary_public_id) {
    await destroyCloudinaryAsset(project.cloudinary_public_id, project.media_type).catch(
      (e) => console.error("Cloudinary cleanup failed:", e)
    );
  }

  return NextResponse.json({ ok: true });
}
