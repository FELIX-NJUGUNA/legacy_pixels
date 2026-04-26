import type { Metadata } from "next";
import Portfolio from "@/components/sections/Portfolio";

export const metadata: Metadata = {
  title: "Portfolio — Legacy Pixels",
  description: "Browse the full portfolio of Legacy Pixels — editorial photography, wedding films, commercial work, and documentary projects.",
};

export default function PortfolioPage() {
  return (
    <div className="pt-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-20 pb-10">
        <p className="label-text mb-4">All Work</p>
        <h1 className="display-text text-[clamp(3rem,6vw,5.5rem)] text-silk leading-[0.92]">
          Full Portfolio
        </h1>
      </div>
      <Portfolio />
    </div>
  );
}
