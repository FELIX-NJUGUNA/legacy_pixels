import { NextResponse } from "next/server";

// Returns a Drive API download URL that Cloudinary can fetch (more reliable than uc?export=download).
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  const key = process.env.GOOGLE_API_KEY;
  if (!id || !key)
    return NextResponse.json({ error: "Missing id or GOOGLE_API_KEY" }, { status: 400 });
  return NextResponse.json({
    url: `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true&key=${key}`,
  });
}
