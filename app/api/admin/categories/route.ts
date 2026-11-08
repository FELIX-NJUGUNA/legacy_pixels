import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { revalidateSite } from "@/lib/revalidate";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const supabase = createAdminSupabase();

  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: name.trim(),
      slug: slugify(name),
      sort_order: (last?.[0]?.sort_order ?? -1) + 1,
    })
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
  return NextResponse.json(data, { status: 201 });
}
