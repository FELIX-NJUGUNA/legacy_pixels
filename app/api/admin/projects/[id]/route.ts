import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { assetInUse } from "@/lib/asset-usage";
import { revalidateSite } from "@/lib/revalidate";

async function cleanupAsset(supabase: any, publicId: string, mediaType: string, excludeId: string) {
  try {
    // never delete a file another project or the hero still uses
    if (await assetInUse(supabase, publicId, excludeId)) return;
    await destroyCloudinaryAsset(publicId, mediaType);
  } catch (e) {
    console.error("Cloudinary cleanup failed:", e);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createAdminSupabase();

  if (!body.title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const update: Record<string, unknown> = {
    title: body.title,
    category_id: body.category_id || null,
    year: body.year || null,
    aspect: body.aspect,
    tags: body.tags ?? [],
    published: body.published,
  };

  let oldAsset: { cloudinary_public_id: string | null; media_type: string } | null = null;

  if (body.media_url) {
    const { data: old } = await supabase
      .from("projects")
      .select("cloudinary_public_id, media_type")
      .eq("id", id)
      .single();
    oldAsset = old;

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

  if (oldAsset?.cloudinary_public_id && oldAsset.cloudinary_public_id !== body.cloudinary_public_id) {
    await cleanupAsset(supabase, oldAsset.cloudinary_public_id, oldAsset.media_type, id);
  }

  revalidateSite();
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const allowed = ["title", "category_id", "year", "aspect", "tags", "published", "sort_order"];
  const update: Record<string, unknown> = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );
  if ("category_id" in update) update.category_id = update.category_id || null;

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateSite();
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
    await cleanupAsset(supabase, project.cloudinary_public_id, project.media_type, id);
  }

  revalidateSite();
  return NextResponse.json({ ok: true });
}
