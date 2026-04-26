"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Category } from "@/lib/portfolio-data";

const categories: Category[] = ["All", "Editorial", "Weddings", "Commercial", "Film"];

export default function Portfolio() {
  const [active, setActive] = useState<Category>("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".section-reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-32 px-6 md:px-12 max-w-screen-xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 section-reveal">
        <div>
          <p className="label-text mb-4">Selected Work</p>
          <h2 className="display-text text-[clamp(2.5rem,5vw,4.5rem)] text-silk leading-[0.92]">
            The Portfolio
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`label-text text-[0.65rem] px-5 py-2 border transition-all duration-300 ${
                active === cat
                  ? "border-gold bg-gold text-void"
                  : "border-white/10 text-mist hover:border-gold/50 hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filtered.map((project, i) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`portfolio-item group ${
                project.aspect === "landscape" && i % 5 === 0
                  ? "md:col-span-2"
                  : ""
              }`}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`relative overflow-hidden bg-graphite ${
                  project.aspect === "portrait"
                    ? "aspect-[3/4]"
                    : project.aspect === "square"
                    ? "aspect-square"
                    : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="overlay absolute inset-0 bg-gradient-to-t from-void/95 via-void/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="label-text text-[0.6rem] mb-2 text-gold">
                    {project.category} — {project.year}
                  </p>
                  <h3
                    className="text-silk text-xl mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                    }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="label-text text-[0.55rem] border border-white/20 px-2 py-0.5 text-mist"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project number */}
                <div className="absolute top-4 right-4 label-text text-[0.65rem] text-mist/40 group-hover:text-gold transition-colors duration-300">
                  {project.id}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* View more */}
      <div className="mt-16 text-center section-reveal">
        <a
          href="/portfolio"
          className="inline-flex items-center gap-3 label-text text-mist hover:text-gold transition-colors duration-300 group"
        >
          View All Projects
          <span className="inline-block w-8 h-px bg-mist group-hover:bg-gold group-hover:w-12 transition-all duration-300" />
        </a>
      </div>
    </section>
  );
}
