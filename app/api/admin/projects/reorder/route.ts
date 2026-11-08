import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { revalidateSite } from "@/lib/revalidate";

// Body: { ids: string[] } — full ordered list; position becomes sort_order.
export async function POST(req: NextRequest) {
  const { ids } = await req.json();
  if (!Array.isArray(ids) || !ids.length) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  const results = await Promise.all(
    ids.map((id: string, index: number) =>
      supabase.from("projects").update({ sort_order: index }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  revalidateSite();
  return NextResponse.json({ ok: true });
}
