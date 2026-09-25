import crypto from "crypto";

/**
 * Deletes an asset from Cloudinary using a signed request to the Admin API.
 * Requires CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (server-only env vars,
 * NOT prefixed with NEXT_PUBLIC_).
 */
export async function destroyCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const form = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    { method: "POST", body: form }
  );

  if (!res.ok) throw new Error(`Cloudinary destroy failed: ${res.status}`);
  return res.json();
}
