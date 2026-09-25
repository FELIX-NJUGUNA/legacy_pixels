"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    cloudinary?: any;
  }
}

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video";
  width?: number;
  height?: number;
};

export default function CloudinaryUploadButton({
  onUploaded,
}: {
  onUploaded: (result: CloudinaryUploadResult) => void;
}) {
  const widgetRef = useRef<any>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [preview, setPreview] = useState<CloudinaryUploadResult | null>(null);

  useEffect(() => {
    if (window.cloudinary) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  function openWidget() {
    if (!window.cloudinary) return;

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          // "google_drive" requires enabling the Google Drive add-on / API key
          // in your Cloudinary console (Settings → Upload → Upload widget sources)
          sources: ["local", "camera", "google_drive", "url"],
          multiple: false,
          resourceType: "auto",
          folder: "legacy-pixels/portfolio",
          clientAllowedFormats: ["image", "video"],
          maxFileSize: 200 * 1024 * 1024,
        },
        (error: any, result: any) => {
          if (error) {
            console.error(error);
            return;
          }
          if (result.event === "success") {
            const info = result.info;
            const uploaded: CloudinaryUploadResult = {
              secure_url: info.secure_url,
              public_id: info.public_id,
              resource_type: info.resource_type,
              width: info.width,
              height: info.height,
            };
            setPreview(uploaded);
            onUploaded(uploaded);
          }
        }
      );
    }
    widgetRef.current.open();
  }

  return (
    <div>
      <button
        type="button"
        onClick={openWidget}
        disabled={!scriptReady}
        className="border border-white/20 px-5 py-2 text-xs uppercase tracking-widest text-mist hover:border-[#E8610A] hover:text-[#E8610A] transition-colors disabled:opacity-50"
      >
        {scriptReady ? "Upload media" : "Loading…"}
      </button>

      {preview && (
        <div className="mt-3">
          {preview.resource_type === "video" ? (
            <video src={preview.secure_url} className="w-40 h-28 object-cover" controls muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.secure_url} alt="" className="w-40 h-28 object-cover" />
          )}
        </div>
      )}
    </div>
  );
}
