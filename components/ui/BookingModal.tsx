"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PackageTier } from "@/lib/portfolio-data";

const WHATSAPP_NUMBER = "254719155919"; // from +254 0719155919, leading 0 dropped for intl format — verify this
const STUDIO_EMAIL = "legacypixelske@gmail.com";

function formatKES(n: number) {
  return `KSh ${n.toLocaleString("en-KE")}`;
}

export default function BookingModal({
  categoryTitle,
  tier,
  onClose,
}: {
  categoryTitle: string;
  tier: PackageTier | null;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [negotiate, setNegotiate] = useState(false);
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function buildMessage() {
    const lines = [
      `Hi Legacy Pixels! I'd like to book a shoot.`,
      ``,
      `Package: ${categoryTitle}${tier ? ` — ${tier.name}` : " — Custom"}`,
      tier ? `Listed price: ${formatKES(tier.price)}` : null,
      `Name: ${name || "-"}`,
      `Phone: ${phone || "-"}`,
      email ? `Email: ${email}` : null,
      date ? `Preferred date: ${date}` : null,
      notes ? `Notes: ${notes}` : null,
      negotiate && budget
        ? `Proposed budget: KSh ${Number(budget).toLocaleString("en-KE")} — open to discussing what fits within this.`
        : null,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const mailtoHref = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(
    `Booking enquiry — ${categoryTitle}${tier ? `: ${tier.name}` : ""}`
  )}&body=${encodeURIComponent(buildMessage())}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-obsidian border border-white/10 p-8 md:p-10 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-mist/50 hover:text-gold text-xl transition-colors"
        >
          ✕
        </button>

        {!sent ? (
          <>
            <p className="label-text text-[0.6rem] text-gold/70 mb-3">
              {categoryTitle}
              {tier ? ` — ${tier.name}` : ""}
            </p>
            <h3
              className="text-3xl text-silk mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Book This Shoot
            </h3>
            {tier && (
              <p className="text-mist text-sm mb-8">
                Listed at {formatKES(tier.price)}. Have a different budget?
                Toggle the option below — happy to talk it through.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-gold py-3 text-sm text-silk placeholder:text-mist/30 outline-none transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone / WhatsApp"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-gold py-3 text-sm text-silk placeholder:text-mist/30 outline-none transition-colors"
                />
              </div>

              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 focus:border-gold py-3 text-sm text-silk placeholder:text-mist/30 outline-none transition-colors"
              />

              <div>
                <label className="label-text text-[0.55rem] text-mist/40 block mb-2">
                  Preferred date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 focus:border-gold py-3 text-sm text-silk outline-none transition-colors [color-scheme:dark]"
                />
              </div>

              <textarea
                placeholder="Location, occasion, or anything else we should know"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 focus:border-gold py-3 text-sm text-silk placeholder:text-mist/30 outline-none transition-colors resize-none"
              />

              <div className="border border-white/10 p-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={negotiate}
                    onChange={(e) => setNegotiate(e.target.checked)}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-sm text-silk">
                    I&apos;d like to propose my own budget
                  </span>
                </label>

                {negotiate && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 border-b border-white/10 focus-within:border-gold transition-colors">
                      <span className="text-mist/50 text-sm">KSh</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="Your budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-transparent py-3 text-sm text-silk placeholder:text-mist/30 outline-none"
                      />
                    </div>
                    <p className="text-mist/40 text-xs mt-2 leading-relaxed">
                      We&apos;ll do our best to work something out around your
                      number — scope may adjust to match.
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gold !text-void label-text px-6 py-4 hover:bg-[#FF8C3B] transition-colors duration-300"
              >
                Send via WhatsApp →
              </button>

              <a
                href={mailtoHref}
                className="block text-center text-mist/50 hover:text-gold text-xs transition-colors pt-1"
              >
                Prefer email? Send this enquiry to {STUDIO_EMAIL}
              </a>
            </form>
          </>
        ) : (
          <div className="py-10 text-center">
            <div className="w-12 h-px bg-gold mx-auto mb-8" />
            <h3
              className="text-3xl text-silk mb-4"
              style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
            >
              Almost There
            </h3>
            <p className="text-mist text-sm max-w-xs mx-auto leading-relaxed mb-8">
              We opened WhatsApp with your details filled in — just hit send
              on your end and we&apos;ll reply within a few hours.
            </p>
            <button
              onClick={onClose}
              className="label-text text-[0.65rem] text-gold border-b border-gold/40 pb-1 hover:border-gold transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}