// Pure module (safe for client + server). Defaults = what your hero shows today.

export type HeroPhase = { tag: string; lines: string[]; sub: string };
export type HeroStat = { n: string; l: string };
export type HeroConfig = {
  lens_image: string;
  strip_a: string[];
  strip_b: string[];
  phases: HeroPhase[]; // always 3
  stats: HeroStat[]; // always 3
};

export const DEFAULT_HERO: HeroConfig = {
  lens_image:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=60",
  strip_a: [
    "https://res.cloudinary.com/drf22orgz/image/upload/v1779904292/LEGACY_1637_svyzui.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1779904289/LEGACY_5156_rym17y.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159523/LEGACY_13719_-_Copy_nmh1of.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159456/LEGACY_13731_-_Copy_qmejox.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159455/LEGACY_13732_-_Copy_buotrq.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1783669501/LEGACY_4700_zpfrxv.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1783669502/LEGACY_6145_hb9ykv.jpg",
  ],
  strip_b: [
    "https://res.cloudinary.com/drf22orgz/image/upload/v1779904292/LEGACY_1681_br4ibp.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1779904290/LEGACY_2858_exohkc.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159512/LEGACY_13723_-_Copy_skcldf.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159440/LEGACY_13747_jwjhtj.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1794159521/LEGACY_13721_-_Copy_nwmlqq.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1783669503/LEGACY_5896_rewno4.jpg",
    "https://res.cloudinary.com/drf22orgz/image/upload/v1783669500/LEGACY_1233_twnx9m.jpg",
  ],
  phases: [
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
  ],
  stats: [
    { n: "320+", l: "Projects" },
    { n: "8", l: "Years" },
    { n: "12", l: "Awards" },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v.trim() : fallback);
const urls = (v: unknown, fallback: string[]) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && /^https?:\/\//.test(x)) : fallback;

/** Merges stored/edited data over the defaults and guarantees a valid shape. */
export function sanitizeHero(input: any): HeroConfig {
  const d = DEFAULT_HERO;
  const phases = [0, 1, 2].map((i) => {
    const p = input?.phases?.[i];
    const dp = d.phases[i];
    const lines = Array.isArray(p?.lines) ? p.lines.map((l: unknown) => str(l)).filter(Boolean) : dp.lines;
    return { tag: str(p?.tag, dp.tag), lines: lines.length ? lines : dp.lines, sub: str(p?.sub, dp.sub) };
  });
  const stats = [0, 1, 2].map((i) => ({
    n: str(input?.stats?.[i]?.n, d.stats[i].n) || d.stats[i].n,
    l: str(input?.stats?.[i]?.l, d.stats[i].l) || d.stats[i].l,
  }));
  return {
    lens_image: str(input?.lens_image) || d.lens_image,
    strip_a: urls(input?.strip_a, d.strip_a),
    strip_b: urls(input?.strip_b, d.strip_b),
    phases,
    stats,
  };
}
