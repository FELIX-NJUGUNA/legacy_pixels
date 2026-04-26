"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      // Dot: instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      // Ring: lagged
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Hover effect
    const handleEnter = () => {
      dotRef.current?.classList.add("scale-0");
      ringRef.current?.classList.add("scale-150", "border-gold");
      ringRef.current?.classList.remove("border-silk/30");
    };
    const handleLeave = () => {
      dotRef.current?.classList.remove("scale-0");
      ringRef.current?.classList.remove("scale-150", "border-gold");
      ringRef.current?.classList.add("border-silk/30");
    };

    const interactiveEls = document.querySelectorAll(
      "a, button, [data-cursor]"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-[10000] transition-transform duration-100"
        style={{ willChange: "transform" }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-silk/30 pointer-events-none z-[10000] transition-[transform,border-color] duration-200"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
