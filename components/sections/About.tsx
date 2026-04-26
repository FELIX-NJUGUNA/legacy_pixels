"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const marqueeWords = [
  "Photography",
  "•",
  "Videography",
  "•",
  "Editorial",
  "•",
  "Wedding Films",
  "•",
  "Commercial",
  "•",
  "Documentary",
  "•",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".section-reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Marquee strip */}
      <div className="border-y border-white/5 py-5 bg-obsidian overflow-hidden">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: "marquee 25s linear infinite",
          }}
        >
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span
              key={i}
              className={`label-text text-xs flex-shrink-0 ${
                w === "•" ? "text-gold" : "text-mist/40"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-32">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          {/* Text side */}
          <div className="section-reveal">
            <p className="label-text mb-6">About the Studio</p>
            <h2 className="display-text text-[clamp(2.5rem,4vw,3.8rem)] text-silk leading-[0.92] mb-10">
              We don&apos;t just capture moments. We compose legacies.
            </h2>
            <div className="space-y-5 text-mist text-sm leading-relaxed">
              <p>
                Founded in Nairobi, Legacy Pixels has spent eight years
                perfecting the art of visual storytelling. Every project we
                take on is approached with the same philosophy: intentional
                light, precise composition, and an unwavering commitment to
                emotional truth.
              </p>
              <p>
                Whether it&apos;s a sprawling wedding in the Rift Valley, a
                fashion editorial, or a commercial film for a global brand —
                our process begins long before the shutter clicks. We
                pre-visualize, we scout, we collaborate, and we obsess over
                details that most never notice.
              </p>
              <p>
                The result? Work that stops people mid-scroll. Images that get
                framed. Films that get rewatched.
              </p>
            </div>

            <div className="mt-12 flex gap-10">
              {[
                { n: "320+", l: "Projects Delivered" },
                { n: "3", l: "Continents Shot On" },
                { n: "12", l: "Industry Awards" },
              ].map((s) => (
                <div key={s.l}>
                  <p
                    className="text-4xl text-silk"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                    }}
                  >
                    {s.n}
                  </p>
                  <p className="label-text text-[0.6rem] mt-1 text-mist/60">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="section-reveal relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=700&q=80"
                alt="Photographer at work"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gold corner accent */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-gold/60" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-gold/60" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-obsidian border border-white/10 p-6 max-w-[200px]">
              <p
                className="text-gold text-2xl mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
              >
                8+
              </p>
              <p className="label-text text-[0.6rem] text-mist/60">
                Years of visual craft
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
