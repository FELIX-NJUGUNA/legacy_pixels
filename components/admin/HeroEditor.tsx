"use client";

import { useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { thumbUrl } from "@/lib/cloudinary-upload";
import { DEFAULT_HERO, type HeroConfig } from "@/lib/hero-defaults";
import MediaAdder from "./MediaAdder";

const input =
  "w-full bg-transparent border border-white/20 px-3 py-2 text-sm outline-none focus:border-[#E8610A]";
const label = "block text-[11px] uppercase tracking-widest text-mist/60 mb-2";
const mini =
  "bg-black/70 text-[#f5f0ea] w-7 h-7 flex items-center justify-center text-sm hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-30";

type StripKey = "strip_a" | "strip_b";

export default function HeroEditor({ initial }: { initial: HeroConfig }) {
  const [cfg, setCfg] = useState<HeroConfig>(initial);
  const saved = useRef(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);

  const dirty = JSON.stringify(cfg) !== saved.current;

  function setStrip(key: StripKey, fn: (arr: string[]) => string[]) {
    setCfg((c) => ({ ...c, [key]: fn(c[key]) }));
  }
  const move = (key: StripKey, i: number, dir: -1 | 1) =>
    setStrip(key, (arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function save() {
    setSaving(true);
    setNotice(null);
    try {
      const result = await adminFetch<HeroConfig>("/api/admin/hero", "PUT", cfg);
      setCfg(result);
      saved.current = JSON.stringify(result);
      setNotice({ type: "ok", text: "Saved — your homepage hero is updated." });
    } catch (e) {
      setNotice({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function Strip({ k, title, hint }: { k: StripKey; title: string; hint: string }) {
    const arr = cfg[k];
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-lg" style={{ fontFamily: "Georgia, serif" }}>{title}</h2>
          <p className="text-[11px] text-mist/50">{hint} · {arr.length} images</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {arr.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl(url, "image", 400)}
                alt=""
                loading="lazy"
                onClick={() => setViewing(url)}
                className="w-full aspect-[3/4] object-cover cursor-zoom-in"
              />
              <span className="absolute top-1 left-1 bg-black/70 text-[10px] px-1.5 py-0.5">{i + 1}</span>
              <div className="absolute bottom-1 inset-x-1 flex justify-between">
                <span className="flex gap-1">
                  <button className={mini} disabled={i === 0} onClick={() => move(k, i, -1)} aria-label="Move earlier">←</button>
                  <button className={mini} disabled={i === arr.length - 1} onClick={() => move(k, i, 1)} aria-label="Move later">→</button>
                </span>
                <button
                  className={`${mini} hover:!bg-red-500`}
                  onClick={() => setStrip(k, (a) => a.filter((_, x) => x !== i))}
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {arr.length === 0 && <p className="text-sm text-mist/50 col-span-full">No images — add some below.</p>}
        </div>
        <MediaAdder label={`Add to ${title}`} onAdded={(rs) => setStrip(k, (a) => [...a, ...rs.map((r) => r.media_url)])} />
      </section>
    );
  }

  return (
    <div className="max-w-5xl space-y-12 pb-28">
      {/* Lens background */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg" style={{ fontFamily: "Georgia, serif" }}>Background image</h2>
          <p className="text-[11px] text-mist/50">Shown behind the intro text (first two scroll phases)</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl(cfg.lens_image, "image", 900)}
          alt="Hero background"
          onClick={() => setViewing(cfg.lens_image)}
          className="w-full max-w-xl aspect-video object-cover border border-white/10 cursor-zoom-in"
        />
        <div className="max-w-xl">
          <MediaAdder
            multiple={false}
            label="Replace background"
            onAdded={([r]) => setCfg((c) => ({ ...c, lens_image: r.media_url }))}
          />
        </div>
      </section>

      {Strip({ k: "strip_a", title: "Scrolling strip — left", hint: "Scrolls upward in the final phase" })}
      {Strip({ k: "strip_b", title: "Scrolling strip — right", hint: "Scrolls downward in the final phase" })}

      {/* Copy */}
      <section className="space-y-6">
        <h2 className="text-lg" style={{ fontFamily: "Georgia, serif" }}>Hero text (3 scroll phases)</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {cfg.phases.map((p, i) => (
            <div key={i} className="border border-white/10 p-4 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#E8610A]">Phase {i + 1}</p>
              <div>
                <label className={label}>Small tag</label>
                <input
                  className={input}
                  value={p.tag}
                  onChange={(e) =>
                    setCfg((c) => ({ ...c, phases: c.phases.map((x, j) => (j === i ? { ...x, tag: e.target.value } : x)) }))
                  }
                />
              </div>
              <div>
                <label className={label}>Headline (one line per row)</label>
                <textarea
                  rows={4}
                  className={input}
                  value={p.lines.join("\n")}
                  onChange={(e) =>
                    setCfg((c) => ({
                      ...c,
                      phases: c.phases.map((x, j) => (j === i ? { ...x, lines: e.target.value.split("\n") } : x)),
                    }))
                  }
                />
              </div>
              <div>
                <label className={label}>Sub text</label>
                <textarea
                  rows={4}
                  className={input}
                  value={p.sub}
                  onChange={(e) =>
                    setCfg((c) => ({ ...c, phases: c.phases.map((x, j) => (j === i ? { ...x, sub: e.target.value } : x)) }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h2 className="text-lg" style={{ fontFamily: "Georgia, serif" }}>Stats row</h2>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
          {cfg.stats.map((s, i) => (
            <div key={i} className="space-y-2">
              <input
                className={input}
                value={s.n}
                placeholder="320+"
                onChange={(e) =>
                  setCfg((c) => ({ ...c, stats: c.stats.map((x, j) => (j === i ? { ...x, n: e.target.value } : x)) }))
                }
              />
              <input
                className={input}
                value={s.l}
                placeholder="Projects"
                onChange={(e) =>
                  setCfg((c) => ({ ...c, stats: c.stats.map((x, j) => (j === i ? { ...x, l: e.target.value } : x)) }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#0d0d12]/95 border-t border-white/10 px-6 md:px-12 py-4 flex flex-wrap items-center gap-4">
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="border border-[#E8610A] text-[#E8610A] px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#E8610A] hover:text-[#060608] transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save hero"}
        </button>
        <button
          onClick={() => {
            if (window.confirm("Reset the hero to the original defaults? (Not saved until you press Save.)"))
              setCfg(DEFAULT_HERO);
          }}
          className="text-xs uppercase tracking-widest text-mist hover:text-[#f5f0ea]"
        >
          Reset to defaults
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest text-mist hover:text-[#E8610A]">
          View site ↗
        </a>
        {dirty && !notice && <span className="text-xs text-[#E8610A]">Unsaved changes</span>}
        {notice && (
          <span className={`text-xs ${notice.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>{notice.text}</span>
        )}
      </div>

      {/* Lightbox */}
      {viewing && (
        <div
          onClick={() => setViewing(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbUrl(viewing, "image", 1800)} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
