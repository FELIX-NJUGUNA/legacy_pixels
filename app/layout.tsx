import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legacy Pixels — Photography & Videography",
  description:
    "Visual storytelling through the lens. Legacy Pixels captures moments that endure — editorial photography, cinematic videography, and timeless portraits.",
  keywords: ["photography", "videography", "portfolio", "legacy pixels", "cinematic"],
  openGraph: {
    title: "Legacy Pixels",
    description: "Visual storytelling through the lens.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-void text-silk antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}