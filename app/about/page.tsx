import type { Metadata } from "next";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About — Legacy Pixels",
  description: "The story behind Legacy Pixels — a Nairobi-based photography and videography studio.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-20 pb-10">
        <p className="label-text mb-4">Our Story</p>
        <h1 className="display-text text-[clamp(3rem,6vw,5.5rem)] text-silk leading-[0.92]">
          Behind the<br />Lens.
        </h1>
      </div>
      <About />
    </div>
  );
}
