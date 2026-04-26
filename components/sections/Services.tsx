"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/lib/portfolio-data";

const FloatingAperture = dynamic(
  () => import("@/components/3d/FloatingAperture"),
  { ssr: false, loading: () => <div className="w-full h-full bg-transparent" /> }
);

export default function Services() {
  const [open, setOpen] = useState<string | null>("01");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".section-reveal").forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-obsidian py-32 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          {/* Left: Services accordion */}
          <div>
            <div className="section-reveal mb-16">
              <p className="label-text mb-4">What We Offer</p>
              <h2 className="display-text text-[clamp(2.5rem,4vw,3.8rem)] text-silk leading-[0.92]">
                Services
              </h2>
            </div>

            <div className="space-y-0">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="border-t border-white/5 section-reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <button
                    onClick={() =>
                      setOpen(open === service.id ? null : service.id)
                    }
                    className="w-full flex items-center justify-between py-7 text-left group"
                  >
                    <div className="flex items-center gap-6">
                      <span className="label-text text-[0.6rem] text-gold/40">
                        {service.id}
                      </span>
                      <span
                        className={`text-xl transition-colors duration-300 ${
                          open === service.id ? "text-gold" : "text-silk group-hover:text-gold"
                        }`}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 300,
                        }}
                      >
                        {service.title}
                      </span>
                    </div>
                    <span
                      className={`text-gold text-2xl transition-transform duration-300 ${
                        open === service.id ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {open === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-12">
                          <p className="text-mist text-sm leading-relaxed mb-5">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="label-text text-[0.58rem] border border-gold/20 text-gold/60 px-3 py-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="border-t border-white/5" />
            </div>
          </div>

          {/* Right: 3D Aperture */}
          <div className="section-reveal flex flex-col items-center">
            <div className="w-full aspect-square max-w-md relative">
              <FloatingAperture />
            </div>
            <div className="mt-8 text-center">
              <p className="label-text text-[0.6rem] text-mist/40 mb-3">
                Custom packages available
              </p>
              <a
                href="/contact"
                className="relative overflow-hidden border border-gold/40 text-gold hover:text-void transition-colors duration-400 label-text px-8 py-3 inline-block group"
              >
                <span className="relative z-10">Request a Quote</span>
                <span className="absolute inset-0 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
