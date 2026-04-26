import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-void text-silk antialiased">
        {/* Film grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Custom cursor */}
        <CustomCursor />

        {/* Smooth scroll wrapper */}
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
