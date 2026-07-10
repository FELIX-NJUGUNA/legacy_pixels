"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════
   IMAGE CATALOG
══════════════════════════════════════════ */
const STRIP_A = [
  "https://res.cloudinary.com/drf22orgz/image/upload/v1779904292/LEGACY_1637_svyzui.jpg",
  "https://res.cloudinary.com/drf22orgz/image/upload/v1779904289/LEGACY_5156_rym17y.jpg",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=85",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=700&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=85",
];
const STRIP_B = [
  "https://res.cloudinary.com/drf22orgz/image/upload/v1779904292/LEGACY_1681_br4ibp.jpg",
  "https://res.cloudinary.com/drf22orgz/image/upload/v1779904290/LEGACY_2858_exohkc.jpg",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=85",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=700&q=85",
  "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=700&q=85",
];

/* ══════════════════════════════════════════
   PHASE COPY
══════════════════════════════════════════ */
const PHASES = [
  {
    tag: "Photography & Videography Studio",
    lines: ["Moments", "Forged in", "Light."],
    sub: "Legacy Pixels — where every frame is composed with intent, and every film is cut to endure.",
  },
  {
    tag: "Step Inside",
    lines: ["Enter the", "Frame."],
    sub: "Every zoom. Every click. Every breath held before the shutter falls.",
  },
  {
    tag: "The Portfolio",
    lines: ["320+", "Stories", "Captured."],
    sub: "Weddings. Landscapes. Life itself in motion.",
  },
];

/* ══════════════════════════════════════════
   TICK MARKS — computed once at module load,
   never rebuilt on render
══════════════════════════════════════════ */
const TICK_MARKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const maj = i % 9 === 0;
  const r1 = 193;
  const r2 = maj ? 177 : 186;
  return {
    key: i,
    x1: 200 + Math.cos(a) * r1,
    y1: 200 + Math.sin(a) * r1,
    x2: 200 + Math.cos(a) * r2,
    y2: 200 + Math.sin(a) * r2,
    maj,
  };
});

/* ══════════════════════════════════════════
   CAMERA APERTURE — CSS-driven rotation,
   memoized so scroll updates never re-render it
══════════════════════════════════════════ */
const CameraAperture = memo(function CameraAperture() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <style>{`
        .cam-blade-group {
          transform-box: view-box;
          transform-origin: 200px 200px;
          animation: cam-spin 16s linear infinite;
          will-change: transform;
        }
        @keyframes cam-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cam-blade-group { animation: none; }
        }
      `}</style>

      <defs>
        <linearGradient id="cag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#FF8C3B" />
          <stop offset="45%"  stopColor="#E8610A" />
          <stop offset="100%" stopColor="#A84200" />
        </linearGradient>
        <radialGradient id="clg" cx="42%" cy="36%" r="56%">
          <stop offset="0%"   stopColor="#1e0a04" />
          <stop offset="45%"  stopColor="#0d0608" />
          <stop offset="100%" stopColor="#060608" />
        </radialGradient>
        <radialGradient id="ehaze" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#E8610A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#E8610A" stopOpacity="0"    />
        </radialGradient>
        <filter id="csg" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        {/* Blade glow — applied once to the whole rotating group */}
        <filter id="cbg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
      </defs>

      <circle cx="200" cy="200" r="196" fill="url(#ehaze)" />
      <circle cx="200" cy="200" r="196" fill="none"
        stroke="#E8610A" strokeWidth="6" opacity="0.09" filter="url(#csg)" />
      <circle cx="200" cy="200" r="193" fill="none" stroke="#E8610A" strokeWidth="1.2" opacity="0.45" />
      <circle cx="200" cy="200" r="185" fill="none" stroke="#FF8C3B" strokeWidth="0.5" opacity="0.18" />

      {TICK_MARKS.map(t => (
        <line key={t.key}
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={t.maj ? "#FF8C3B" : "#E8610A"}
          strokeWidth={t.maj ? 2 : 0.7}
          opacity={t.maj ? 0.7 : 0.22}
        />
      ))}

      {/* ── Rotating blade group — CSS-driven, single filter pass ── */}
      <g className="cam-blade-group" filter="url(#cbg)">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45},200,200)`}>
            <ellipse cx="308" cy="200" rx="56" ry="20" fill="url(#cag)" opacity="0.95" />
            <ellipse cx="308" cy="197" rx="52" ry="8"
              fill="none" stroke="#FF8C3B" strokeWidth="0.7" opacity="0.3" />
            <ellipse cx="308" cy="204" rx="50" ry="7"
              fill="none" stroke="#3d1200" strokeWidth="0.5" opacity="0.22" />
          </g>
        ))}
      </g>

      <circle cx="200" cy="200" r="66" fill="none"
        stroke="#E8610A" strokeWidth="4" opacity="0.95" filter="url(#csg)" />
      <circle cx="200" cy="200" r="58" fill="none"
        stroke="#FF8C3B" strokeWidth="0.9" opacity="0.55" />
      <circle cx="200" cy="200" r="56" fill="url(#clg)" />
      <circle cx="200" cy="200" r="56" fill="none" stroke="#E8610A" strokeWidth="1.8" opacity="0.20" />
      <circle cx="200" cy="200" r="48" fill="none" stroke="#FF8C3B" strokeWidth="0.8" opacity="0.11" />
      <circle cx="200" cy="200" r="38" fill="none" stroke="#A84200" strokeWidth="0.5" opacity="0.10" />
      <ellipse cx="183" cy="182" rx="16" ry="9"  fill="white" opacity="0.04"
        transform="rotate(-28,183,182)" />
      <circle  cx="217" cy="220" r="5"            fill="white" opacity="0.025" />
      <ellipse cx="200" cy="200" rx="22" ry="6"   fill="none"
        stroke="white" strokeWidth="0.5" opacity="0.05" />
      <circle cx="200" cy="200" r="56"
        fill="none" stroke="#E8610A" strokeWidth="12" opacity="0.06" />
    </svg>
  );
});

/* ══════════════════════════════════════════
   FRAMELESS IMAGE STRIP
══════════════════════════════════════════ */
const ImageStrip = memo(function ImageStrip({
  images,
  direction,
  speed,
}: {
  images: string[];
  direction: "up" | "down";
  speed: number;
}) {
  const doubled = [...images, ...images];
  return (
    <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          animation: `lp-${direction} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((url, i) => (
          <div key={i} style={{ flexShrink: 0, height: "280px", overflow: "hidden" }}>
            <img
              src={url}
              alt=""
              loading="lazy"
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
══════════════════════════════════════════ */
export default function CinematicHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);

  /* ── Scroll tracking — rAF-throttled so we update
     at most once per frame, not once per scroll event ── */
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

  /* ── Phase boundaries ──
     0 → 0.28 : aperture visible, text set 1
     0.28 → 0.64 : zooming in,    text set 2
     0.64 → 1    : gallery open,  text set 3
  */
  const phase = prog < 0.28 ? 0 : prog < 0.64 ? 1 : 2;

  /* Aperture zoom: eased power curve, starts at 0.22 */
  const zT     = Math.max(0, Math.min(1, (prog - 0.22) / 0.46));
  const aScale = 1 + Math.pow(zT, 2.2) * 32;

  /* Aperture opacity: fade in 0→0.1, hold, fade out 0.6→0.76 */
  const aOpacity =
    prog < 0.1  ? prog / 0.1 :
    prog < 0.60 ? 1 :
    prog < 0.76 ? 1 - (prog - 0.60) / 0.16 :
    0;

  /* Gallery opacity: fade in 0.66→0.80 */
  const gOpacity = prog < 0.66 ? 0 : prog < 0.80 ? (prog - 0.66) / 0.14 : 1;

  /* Exit blackout: fade in 0.9→1 for smooth hand-off */
  const exitBlack = prog < 0.90 ? 0 : (prog - 0.90) / 0.10;

  const ph = PHASES[phase];

  return (
    <>
      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes lp-up   { from { transform: translateY(0);    } to { transform: translateY(-50%); } }
        @keyframes lp-down { from { transform: translateY(-50%); } to { transform: translateY(0);    } }
        @keyframes ch-rise {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ch-pulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1);   }
          50%      { opacity: 1;   transform: scaleY(1.08); }
        }
      `}</style>

      {/* ── Outer scroll container — gives us scroll distance ── */}
      <div ref={wrapRef} style={{ height: "520vh", position: "relative" }}>

        {/* ── Sticky viewport ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#060608",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
        >

          {/* Radial atmosphere */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at 64% 46%, #130a0c 0%, #060608 68%)",
          }} />

          {/* ── Gallery (behind everything) ── */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", gap: "5px",
            opacity: gOpacity, zIndex: 1,
          }}>
            <ImageStrip images={STRIP_A} direction="up"   speed={24} />
            <ImageStrip images={STRIP_B} direction="down" speed={30} />
          </div>

          {/* Gallery dark veil — keeps text readable */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(6,6,8,0.52)",
            opacity: gOpacity, zIndex: 2,
            pointerEvents: "none",
          }} />

          {/* Left text gradient */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3,
            background:
              "linear-gradient(to right, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.55) 54%, transparent 100%)",
          }} />

          {/* Aperture ambient glow halo */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "min(62vh, 62vw)", height: "min(62vh, 62vw)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 66%)",
            opacity: aOpacity, zIndex: 3, pointerEvents: "none",
          }} />

          {/* ── Camera aperture ── */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", zIndex: 4,
            transform: `translate(-50%,-50%) scale(${aScale})`,
            width: "min(44vh, 44vw)", height: "min(44vh, 44vw)",
            transformOrigin: "center",
            opacity: aOpacity,
            willChange: "transform, opacity",
          }}>
            <CameraAperture />
          </div>

          {/* ── Text overlay ── */}
          <div style={{
            position: "absolute", top: "50%", left: "8%",
            transform: "translateY(-50%)",
            zIndex: 10, maxWidth: "460px",
          }}>
            {/* Tag */}
            <div
              key={`tag-${phase}`}
              style={{
                fontSize: "0.62rem", letterSpacing: "0.18em",
                textTransform: "uppercase", color: "#E8610A",
                marginBottom: "1.4rem",
                display: "flex", alignItems: "center", gap: "12px",
                animation: "ch-rise 0.55s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              <span style={{ width: "30px", height: "1px", background: "#E8610A", flexShrink: 0 }} />
              {ph.tag}
            </div>

            {/* Headline lines */}
            <div key={`hl-${phase}`}>
              {ph.lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: "block",
                    fontSize: "clamp(2.8rem, 7.4vw, 6.5rem)",
                    fontWeight: 300,
                    lineHeight: 0.9,
                    letterSpacing: "-0.025em",
                    color: "#f5f0ea",
                    animation: `ch-rise 0.72s cubic-bezier(0.23,1,0.32,1) ${i * 0.1}s both`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Sub copy */}
            <p
              key={`sub-${phase}`}
              style={{
                marginTop: "1.4rem",
                color: "rgba(245,240,234,0.46)",
                fontSize: "0.83rem", lineHeight: 1.76, maxWidth: "295px",
                animation: "ch-fade 0.9s ease 0.4s both",
              }}
            >
              {ph.sub}
            </p>

            {/* CTAs — visible only in phase 2 */}
            {phase === 2 && (
              <div
                style={{
                  marginTop: "2.2rem",
                  display: "flex", flexWrap: "wrap",
                  gap: "1rem", alignItems: "center",
                  animation: "ch-fade 0.8s ease 0.6s both",
                }}
              >
                <Link
                  href="/#portfolio"
                  style={{
                    display: "inline-block",
                    padding: "0.75rem 1.8rem",
                    border: "1px solid #E8610A",
                    color: "#E8610A",
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "background 0.3s, color 0.3s",
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
                    fontSize: "0.65rem", letterSpacing: "0.14em",
                    textTransform: "uppercase", textDecoration: "none",
                    color: "rgba(245,240,234,0.5)",
                    display: "flex", alignItems: "center", gap: "6px",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#f5f0ea"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,234,0.5)"}
                >
                  Our Story →
                </Link>
              </div>
            )}
          </div>

          {/* ── Stats — phase 0 and 2 ── */}
          {phase !== 1 && (
            <div
              key={`st-${phase}`}
              style={{
                position: "absolute", bottom: "9%", left: "8%",
                display: "flex", gap: "2.8rem", zIndex: 10,
                animation: "ch-fade 0.7s ease both",
              }}
            >
              {([["320+", "Projects"], ["8", "Years"], ["12", "Awards"]] as const).map(([n, l]) => (
                <div key={l}>
                  <div style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    fontWeight: 300, letterSpacing: "-0.03em", color: "#f5f0ea",
                  }}>{n}</div>
                  <div style={{
                    fontSize: "0.56rem", letterSpacing: "0.16em",
                    textTransform: "uppercase", color: "#E8610A",
                    marginTop: "3px",
                    fontFamily: "sans-serif",
                  }}>{l}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Phase progress indicator (right edge) ── */}
          <div style={{
            position: "absolute", right: "2rem", top: "50%",
            transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "8px",
            zIndex: 10,
          }}>
            {[0, 1, 2].map(p => (
              <div key={p} style={{
                width: "3px",
                height: p === phase ? "24px" : "4px",
                borderRadius: "3px",
                background: p === phase ? "#E8610A" : "rgba(201,169,110,0.28)",
                transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
              }} />
            ))}
          </div>

          {/* ── Scroll nudge (visible before user scrolls) ── */}
          {prog < 0.04 && (
            <div style={{
              position: "absolute", bottom: "2.2rem", right: "3rem",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
              zIndex: 10, opacity: 1 - prog * 28,
              fontFamily: "sans-serif",
            }}>
              <span style={{
                fontSize: "0.5rem", letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.32)",
                writingMode: "vertical-rl",
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

          {/* ── Bottom page fade ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "9rem",
            background: "linear-gradient(to top, #060608, transparent)",
            zIndex: 5, pointerEvents: "none",
          }} />

          {/* ── Exit blackout — smooth hand-off to next section ── */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#060608",
            opacity: exitBlack,
            zIndex: 20, pointerEvents: "none",
            transition: "opacity 0.05s linear",
          }} />

        </div>
        {/* /sticky */}
      </div>
      {/* /scroll container */}
    </>
  );
}