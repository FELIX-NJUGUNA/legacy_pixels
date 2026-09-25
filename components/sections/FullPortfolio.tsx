"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Category } from "@/lib/portfolio-data";

const categories: Category[] = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
];

export default function FullPortfolio() {
    const [active, setActive] = useState<Category>("All");
    const sectionRef = useRef<HTMLElement>(null);

    const filtered =
        active === "All" ? projects : projects.filter((p) => p.category === active);

    // Precompute counts per category so tabs can show "Weddings (8)" etc.
    const counts = useMemo(() => {
        const map = new Map<Category, number>();
        map.set("All", projects.length);
        for (const cat of categories) {
            if (cat === "All") continue;
            map.set(cat, projects.filter((p) => p.category === cat).length);
        }
        return map;
    }, []);

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
            ref={sectionRef}
            className="pb-32 px-6 md:px-12 max-w-screen-xl mx-auto"
        >
            {/* Filter bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 section-reveal border-t border-white/10 pt-10">
                <p className="label-text text-mist/60 text-[0.65rem]">
                    {filtered.length} {filtered.length === 1 ? "Project" : "Projects"}
                    {active !== "All" && <span className="text-gold"> — {active}</span>}
                </p>

                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`label-text text-[0.65rem] px-5 py-2 border transition-all duration-300 ${active === cat
                                    ? "border-gold bg-gold !text-void"
                                    : "border-white/10 text-mist hover:border-gold/50 hover:text-gold"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry grid — one extra column on xl since this is the full-browse view */}
            <motion.div
                layout
                className="columns-1 md:columns-2 xl:columns-3 gap-4 [column-fill:_balance]"
            >
                <AnimatePresence>
                    {filtered.map((project, i) => (
                        <motion.article
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
                            className="portfolio-item group mb-4 break-inside-avoid"
                        >
                            <div className="relative overflow-hidden bg-graphite">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={800}
                                    height={
                                        project.aspect === "portrait"
                                            ? 1067
                                            : project.aspect === "square"
                                                ? 800
                                                : 500
                                    }
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.07]"
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
                                        style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
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

            {/* Empty state, just in case a category ever has nothing in it */}
            {filtered.length === 0 && (
                <div className="text-center py-24 section-reveal">
                    <p className="label-text text-mist/40">No projects in this category yet.</p>
                </div>
            )}
        </section>
    );
}