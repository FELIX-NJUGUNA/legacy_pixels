import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { revalidateSite } from "@/lib/revalidate";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Rename
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("categories")
    .update({ name: name.trim(), slug: slugify(name) })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const dup = error.code === "23505";
    return NextResponse.json(
      { error: dup ? "A category with that name already exists" : error.message },
      { status: dup ? 409 : 500 }
    );
  }

  revalidateSite();
  return NextResponse.json(data);
}

// Delete — projects in this category become "Uncategorized" instead of blocking the delete.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminSupabase();

  const { error: detachError } = await supabase
    .from("projects")
    .update({ category_id: null })
    .eq("category_id", id);
  if (detachError) return NextResponse.json({ error: detachError.message }, { status: 500 });

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateSite();
  return NextResponse.json({ ok: true });
}
