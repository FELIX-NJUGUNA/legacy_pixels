import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { sanitizeHero } from "@/lib/hero-defaults";
import { getHeroConfig } from "@/lib/site-data";
import { revalidateSite } from "@/lib/revalidate";

export async function GET() {
  return NextResponse.json(await getHeroConfig());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const config = sanitizeHero(body);

  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "hero", value: config, updated_at: new Date().toISOString() });

  if (error) {
    const missing = /site_settings/.test(error.message) && /(does not exist|schema cache)/i.test(error.message);
    return NextResponse.json(
      { error: missing ? "Table site_settings is missing — run supabase-setup.sql in the Supabase SQL editor." : error.message },
      { status: 500 }
    );
  }

  revalidateSite();
  return NextResponse.json(config);
}
