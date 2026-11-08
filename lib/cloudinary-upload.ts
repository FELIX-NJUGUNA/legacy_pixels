// CLIENT helpers: upload / import to Cloudinary, parse links, thumbnails.

export type UploadResult = {
  media_url: string;
  media_type: "image" | "video";
  cloudinary_public_id: string;
  thumbnail_url: string;
  aspect: "landscape" | "portrait" | "square";
  width: number;
  height: number;
  filename?: string;
};

export function titleFromFilename(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Small, fast preview URL (Cloudinary transformation). Non-Cloudinary URLs pass through. */
export function thumbUrl(url: string, type: string = "image", width = 600) {
  if (!url || !url.includes("/upload/")) return url;
  if (type === "video") {
    return url
      .replace("/upload/", `/upload/so_0,w_${width},c_limit,f_jpg,q_auto/`)
      .replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
  }
  return url.replace("/upload/", `/upload/w_${width},c_limit,f_auto,q_auto/`);
}

function detectAspect(w: number, h: number): UploadResult["aspect"] {
  if (!w || !h) return "landscape";
  const r = w / h;
  if (r > 1.15) return "landscape";
  if (r < 0.87) return "portrait";
  return "square";
}

/** Upload a File — or hand Cloudinary a remote URL to fetch (source can be a string). */
export function uploadToCloudinary(
  source: File | string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      return reject(
        new Error(
          "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, then restart the dev server."
        )
      );
    }

    const fd = new FormData();
    fd.append("file", source);
    fd.append("upload_preset", preset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let json: any = null;
      try {
        json = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status < 200 || xhr.status >= 300 || !json?.secure_url) {
        return reject(new Error(json?.error?.message ?? `Upload failed (${xhr.status})`));
      }
      const type: "image" | "video" = json.resource_type === "video" ? "video" : "image";
      resolve({
        media_url: json.secure_url,
        media_type: type,
        cloudinary_public_id: json.public_id,
        thumbnail_url: thumbUrl(json.secure_url, type, 800),
        aspect: detectAspect(json.width, json.height),
        width: json.width,
        height: json.height,
        filename: json.original_filename,
      });
    };

    xhr.onerror = () => reject(new Error("Network error while uploading to Cloudinary."));
    xhr.send(fd);
  });
}

/* ───────────── link import ───────────── */

export function parseDriveId(input: string): string | null {
  const m =
    input.match(/drive\.google\.com\/(?:file\/d\/|open\?(?:[^#]*&)?id=|uc\?(?:[^#]*&)?id=)([\w-]{10,})/) ??
    input.match(/docs\.google\.com\/[^?#]*[?&]id=([\w-]{10,})/);
  return m ? m[1] : null;
}

export function parseCloudinaryUrl(input: string) {
  const m = input.trim().match(/^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video)\/upload\/(.+)$/i);
  if (!m) return null;
  const [, cloud, type, rest] = m;
  const segs = rest.split("?")[0].split("/");
  const vIdx = segs.findIndex((s) => /^v\d+$/.test(s));
  const idSegs = vIdx >= 0 ? segs.slice(vIdx + 1) : segs; // everything after the version = public id (+ext)
  const joined = idSegs.join("/");
  const ext = joined.match(/\.([a-z0-9]+)$/i)?.[1];
  const idEncoded = joined.replace(/\.[a-z0-9]+$/i, "");
  return {
    type: type as "image" | "video",
    publicId: decodeURIComponent(idEncoded),
    mediaUrl: `https://res.cloudinary.com/${cloud}/${type}/upload/${vIdx >= 0 ? segs[vIdx] + "/" : ""}${idEncoded}${ext ? "." + ext : ""}`,
  };
}

function probeImage(url: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 0, h: 0 });
    img.src = url;
  });
}

export function titleFromLink(link: string) {
  const c = parseCloudinaryUrl(link);
  if (c) {
    const last = c.publicId.split("/").pop() ?? "";
    return titleFromFilename(last.replace(/_[a-z0-9]{6}$/i, "")) || "Imported image";
  }
  return "Imported image";
}

/**
 * Google Drive link → Cloudinary fetches & stores it.
 * Cloudinary link   → registered as-is (no re-upload).
 * Any other https image/video URL → Cloudinary fetches & stores it.
 */
export async function importFromUrl(
  raw: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const input = raw.trim();
  if (!/^https?:\/\//i.test(input)) {
    throw new Error("That doesn't look like a link — it must start with https://");
  }
  if (/drive\.google\.com\/drive\/(u\/\d+\/)?folders\//i.test(input)) {
    throw new Error(
      'Folder links can\'t be imported. Open a single file in Drive → Share → "Anyone with the link" → Copy link. (Or download the folder and use Bulk upload.)'
    );
  }

  const c = parseCloudinaryUrl(input);
  if (c) {
    let w = 0,
      h = 0;
    if (c.type === "image") ({ w, h } = await probeImage(thumbUrl(c.mediaUrl, "image", 800)));
    return {
      media_url: c.mediaUrl,
      media_type: c.type,
      cloudinary_public_id: c.publicId,
      thumbnail_url: thumbUrl(c.mediaUrl, c.type, 800),
      aspect: detectAspect(w, h),
      width: w,
      height: h,
    };
  }

  const driveId = parseDriveId(input);
  const source = driveId ? `https://drive.google.com/uc?export=download&id=${driveId}` : input;
  try {
    return await uploadToCloudinary(source, onProgress);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Import failed";
    throw new Error(
      driveId
        ? `${msg} — make sure the Drive file is shared as "Anyone with the link" (very large files can also be blocked by Google; download + upload instead).`
        : msg
    );
  }
}
