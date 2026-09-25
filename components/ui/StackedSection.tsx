// components/ui/StackedSection.tsx
"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StackedSection({
  children,
  className = "",
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Only the final viewport-height of THIS section's scroll drives the
  // transition — independent of how tall the section's content is.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div
      ref={ref}
      className={`relative ${index > 0 ? "-mt-[10vh]" : ""}`}
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        style={{ scale, opacity, filter }}
        className={`origin-top will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}