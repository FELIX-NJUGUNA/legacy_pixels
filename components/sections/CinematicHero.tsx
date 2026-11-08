"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { DEFAULT_HERO, type HeroConfig } from "@/lib/hero-defaults";

/* ══════════════════════════════════════════
   CLOUDINARY TRANSFORM HELPER
══════════════════════════════════════════ */
function cld(url: string, width = 700) {
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,dpr_auto,c_fill,w_${width}/`
  );
}

function useAspectRatios(images: string[]) {
  const [ratios, setRatios] = useState<Record<string, number>>({});
  useEffect(() => {
    let cancelled = false;
    images.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        const raw = img.naturalWidth / img.naturalHeight;
        const clamped = Math.max(0.55, Math.min(1.9, raw));
        setRatios((prev) => (prev[src] ? prev : { ...prev, [src]: clamped }));
      };
      img.src = cld(src, 500);
    });
    return () => { cancelled = true; };
  }, [images]);
  return ratios;
}

/* ══════════════════════════════════════════
   PRECONNECT
══════════════════════════════════════════ */
function usePreconnect() {
  useEffect(() => {
    const hosts = ["https://res.cloudinary.com", "https://images.unsplash.com"];
    const links = hosts.flatMap((href) => {
      const a = document.createElement("link");
      a.rel = "preconnect"; a.href = href; a.crossOrigin = "anonymous";
      const b = document.createElement("link");
      b.rel = "dns-prefetch"; b.href = href;
      document.head.append(a, b);
      return [a, b];
    });
    return () => links.forEach((l) => l.remove());
  }, []);
}

/* ══════════════════════════════════════════
   LENS BACKGROUND
══════════════════════════════════════════ */
const LensBackground = memo(function LensBackground({ src, opacity }: { src: string; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, opacity,
        pointerEvents: "none", zIndex: 1,
        transition: "opacity 0.4s linear",
      }}
    >
      <img
        src={src.includes("res.cloudinary.com") ? cld(src, 1600) : src}
        alt=""
        fetchPriority="high"
        decoding="async"
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          filter: "grayscale(0.15) brightness(0.55)",
          animation: "lp-lens-zoom 22s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
});

/* ══════════════════════════════════════════
   FRAMELESS IMAGE STRIP — phase 2 only
══════════════════════════════════════════ */
const ImageStrip = memo(function ImageStrip({
  images, direction, speed,
}: { images: string[]; direction: "up" | "down"; speed: number }) {
  const ratios = useAspectRatios(images);
  const doubled = [...images, ...images];

  return (
    <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
      <div style={{
        display: "flex", flexDirection: "column", gap: "5px",
        animation: `lp-${direction} ${speed}s linear infinite`,
      }}>
        {doubled.map((url, i) => (
          <div key={i} style={{ flexShrink: 0, aspectRatio: ratios[url] ?? 1.5, overflow: "hidden" }}>
            <img
              src={cld(url, 640)}
              srcSet={`${cld(url, 400)} 400w, ${cld(url, 640)} 640w, ${cld(url, 900)} 900w`}
              sizes="(max-width: 768px) 45vw, 22vw"
              alt=""
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════
   MAIN — CINEMATIC HERO
   Content now comes from the admin (Hero page). With no `config`
   prop it falls back to the original built-in content.
══════════════════════════════════════════ */
const SCROLL_TRACK_VH = 240;

export default function CinematicHero({ config = DEFAULT_HERO }: { config?: HeroConfig }) {
  const { lens_image, strip_a, strip_b, phases: PHASES, stats } = config;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  usePreconnect();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (!wrapRef.current) return;
      const maxScroll = wrapRef.current.offsetHeight - window.innerHeight;
      setProg(Math.max(0, Math.min(1, window.scrollY / maxScroll)));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phase = prog < 0.28 ? 0 : prog < 0.64 ? 1 : 2;
  const stripOpacity = prog < 0.58 ? 0 : prog < 0.74 ? (prog - 0.58) / 0.16 : 1;
  const lensOpacity = 1 - stripOpacity;
  const exitBlack = prog < 0.87 ? 0 : (prog - 0.87) / 0.08;
  const ph = PHASES[phase];

  return (
    <>
      <style>{`
        @keyframes lp-up   { from { transform: translateY(0);    } to { transform: translateY(-50%); } }
        @keyframes lp-down { from { transform: translateY(-50%); } to { transform: translateY(0);    } }
        @keyframes lp-lens-zoom {
          from { transform: scale(1);    }
          to   { transform: scale(1.12); }
        }
        @keyframes ch-rise {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ch-pulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1);   }
          50%      { opacity: 1;   transform: scaleY(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          img { animation: none !important; }
        }
      `}</style>

      <div ref={wrapRef} style={{ height: `${SCROLL_TRACK_VH}vh`, position: "relative" }}>
        <div
          style={{
            position: "sticky", top: 0, height: "100vh", overflow: "hidden",
            background: "#060608",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 64% 46%, #130a0c 0%, #060608 68%)",
          }} />

          <LensBackground src={lens_image} opacity={lensOpacity} />

          <div style={{
            position: "absolute", inset: 0, display: "flex", gap: "5px",
            opacity: stripOpacity, zIndex: 1,
          }}>
            <ImageStrip images={strip_a} direction="up" speed={24} />
            <ImageStrip images={strip_b} direction="down" speed={30} />
          </div>

          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(6,6,8,0.52)", zIndex: 2, pointerEvents: "none",
          }} />

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
            background: "linear-gradient(to right, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.55) 54%, transparent 100%)",
          }} />

          <div style={{
            position: "absolute", top: "50%", left: "8%",
            transform: "translateY(-50%)", zIndex: 10, maxWidth: "460px",
          }}>
            <div
              key={`tag-${phase}`}
              style={{
                fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#E8610A", marginBottom: "1.4rem",
                display: "flex", alignItems: "center", gap: "12px",
                animation: "ch-rise 0.55s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              <span style={{ width: "30px", height: "1px", background: "#E8610A", flexShrink: 0 }} />
              {ph.tag}
            </div>

            <div key={`hl-${phase}`}>
              {ph.lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "block",
                    fontSize: "clamp(2.8rem, 7.4vw, 6.5rem)",
                    fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.025em",
                    color: "#f5f0ea",
                    animation: `ch-rise 0.72s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s both`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <p
              key={`sub-${phase}`}
              style={{
                marginTop: "1.4rem", color: "rgba(245,240,234,0.46)",
                fontSize: "0.83rem", lineHeight: 1.76, maxWidth: "295px",
                animation: "ch-fade 0.9s ease 0.4s both",
              }}
            >
              {ph.sub}
            </p>

            {phase === 2 && (
              <div style={{
                marginTop: "2.2rem", display: "flex", flexWrap: "wrap",
                gap: "1rem", alignItems: "center",
                animation: "ch-fade 0.8s ease 0.6s both",
              }}>
                <Link
                  href="/#portfolio"
                  style={{
                    display: "inline-block", padding: "0.75rem 1.8rem",
                    border: "1px solid #E8610A", color: "#E8610A",
                    fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    textDecoration: "none", transition: "background 0.3s, color 0.3s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#E8610A";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#060608";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#E8610A";
                  }}
                >
                  View Portfolio
                </Link>
                <Link
                  href="/about"
                  style={{
                    fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase",
                    textDecoration: "none", color: "rgba(245,240,234,0.5)",
                    display: "flex", alignItems: "center", gap: "6px", transition: "color 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#f5f0ea"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,234,0.5)"}
                >
                  Our Story →
                </Link>
              </div>
            )}
          </div>

          {phase !== 1 && (
            <div
              key={`st-${phase}`}
              style={{
                position: "absolute", bottom: "9%", left: "8%",
                display: "flex", gap: "2.8rem", zIndex: 10,
                animation: "ch-fade 0.7s ease both",
              }}
            >
              {stats.map(({ n, l }) => (
                <div key={l}>
                  <div style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    fontWeight: 300, letterSpacing: "-0.03em", color: "#f5f0ea",
                  }}>{n}</div>
                  <div style={{
                    fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "#E8610A", marginTop: "3px", fontFamily: "sans-serif",
                  }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{
            position: "absolute", right: "2rem", top: "50%",
            transform: "translateY(-50%)", display: "flex", flexDirection: "column",
            gap: "8px", zIndex: 10,
          }}>
            {[0, 1, 2].map(p => (
              <div key={p} style={{
                width: "3px", height: p === phase ? "24px" : "4px",
                borderRadius: "3px",
                background: p === phase ? "#E8610A" : "rgba(201,169,110,0.28)",
                transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
              }} />
            ))}
          </div>

          {prog < 0.04 && (
            <div style={{
              position: "absolute", bottom: "2.2rem", right: "3rem",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              zIndex: 10, opacity: 1 - prog * 28, fontFamily: "sans-serif",
            }}>
              <span style={{
                fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.32)", writingMode: "vertical-rl",
              }}>
                Scroll
              </span>
              <div style={{
                width: "1px", height: "64px",
                background: "linear-gradient(to bottom, #E8610A, transparent)",
                animation: "ch-pulse 2.2s ease-in-out infinite",
              }} />
            </div>
          )}

          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "9rem",
            background: "linear-gradient(to top, #060608, transparent)",
            zIndex: 5, pointerEvents: "none",
          }} />

          <div style={{
            position: "absolute", inset: 0, background: "#060608",
            opacity: exitBlack, zIndex: 20, pointerEvents: "none",
            transition: "opacity 0.05s linear",
          }} />
        </div>
      </div>
    </>
  );
}
