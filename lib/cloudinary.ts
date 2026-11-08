// SERVER ONLY — signed deletes using your API secret (no SDK needed).
import { createHash } from "crypto";

export async function destroyCloudinaryAsset(publicId: string, mediaType: string = "image") {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env vars are missing (cloud name, API key or API secret).");
  }

  const resourceType = mediaType === "video" ? "video" : "image";
  const timestamp = Math.floor(Date.now() / 1000);

  // params must be signed in alphabetical order
  const toSign = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: "POST",
    body: new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
      invalidate: "true",
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json.result !== "ok" && json.result !== "not found")) {
    throw new Error(json?.error?.message ?? `Cloudinary destroy failed (${res.status})`);
  }
}