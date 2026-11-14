import { NextResponse } from "next/server";

// Lists every image/video in a PUBLIC Drive folder ("Anyone with the link").
export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({}));
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return NextResponse.json({ error: "GOOGLE_API_KEY is not set" }, { status: 500 });

  const folder = String(url ?? "").match(/folders\/([\w-]+)/)?.[1];
  if (!folder) return NextResponse.json({ error: "Not a Drive folder link" }, { status: 400 });

  const q = `'${folder}' in parents and trashed=false and (mimeType contains 'image/' or mimeType contains 'video/')`;
  const files: { id: string; name: string }[] = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      q,
      fields: "nextPageToken,files(id,name)",
      pageSize: "200",
      orderBy: "name",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
      key,
    });
    if (pageToken) params.set("pageToken", pageToken);
    const r = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
    const data = await r.json();
    if (!r.ok)
      return NextResponse.json({ error: data.error?.message ?? "Drive error" }, { status: r.status });
    files.push(...(data.files ?? []));
    pageToken = data.nextPageToken ?? "";
  } while (pageToken && files.length < 1000);

  if (!files.length)
    return NextResponse.json(
      { error: "No images/videos found. Is the folder shared as 'Anyone with the link'?" },
      { status: 404 }
    );

  return NextResponse.json(
    files.map((f) => ({ name: f.name, link: `https://drive.google.com/file/d/${f.id}/view` }))
  );
}
