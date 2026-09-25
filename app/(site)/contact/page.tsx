import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact — Legacy Pixels",
  description: "Book a session or start a conversation with Legacy Pixels.",
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-20 pb-4">
        <p className="label-text mb-4">Get in Touch</p>
        <h1 className="display-text text-[clamp(3rem,6vw,5.5rem)] text-silk leading-[0.92]">
          Let&apos;s Create<br />Together.
        </h1>
      </div>
      <Contact />
    </div>
  );
}
