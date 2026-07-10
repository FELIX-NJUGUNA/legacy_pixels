"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { packageCategories, type PackageTier } from "@/lib/portfolio-data";
import { useLocalCurrency } from "@/lib/useLocalCurrency";
import BookingModal from "@/components/ui/BookingModal";

function formatKES(amount: number) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

function formatConverted(amount: number, rate: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount * rate);
  } catch {
    return `${currency} ${Math.round(amount * rate).toLocaleString()}`;
  }
}

export default function Packages() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState(packageCategories[0].id);
  const [bookingSelection, setBookingSelection] = useState<{
    categoryTitle: string;
    tier: PackageTier | null;
  } | null>(null);

  const { currency, rate } = useLocalCurrency();

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
  }, [activeCategory]);

  const category = packageCategories.find((c) => c.id === activeCategory)!;

  return (
    <section id="packages" ref={sectionRef} className="bg-void py-32 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="section-reveal mb-4 text-center">
          <p className="label-text mb-4">Investment</p>
          <h2 className="display-text text-[clamp(2.5rem,4.5vw,4rem)] text-silk leading-[0.92] mb-6">
            Packages & Pricing
          </h2>
          <p className="text-mist text-sm max-w-lg mx-auto leading-relaxed">
            Every package is a starting point — happy to tailor deliverables
            or the price around your day. Prices shown in Kenyan Shillings.
          </p>
        </div>

        <div className="section-reveal flex flex-wrap justify-center gap-3 mt-12 mb-4">
          {packageCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`label-text text-[0.62rem] px-6 py-3 border transition-all duration-300 ${activeCategory === c.id
                ? "border-gold bg-gold !text-void"
                : "border-white/10 text-mist hover:border-gold/40 hover:text-gold"
                }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <p className="section-reveal text-mist/60 text-sm text-center max-w-md mx-auto mb-14">
          {category.blurb}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {category.tiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`section-reveal relative flex flex-col border p-8 ${tier.highlight ? "border-gold bg-gold/[0.04]" : "border-white/10"
                }`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {tier.highlight && (
                <span className="label-text text-[0.55rem] !text-void bg-gold px-3 py-1 absolute -top-3 left-8">
                  Most Popular
                </span>
              )}

              <p className="label-text text-[0.62rem] text-gold/70 mb-3">
                {category.title}
              </p>
              <h3
                className="text-2xl text-silk mb-6"
                style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}
              >
                {tier.name}
              </h3>

              <div className="mb-8">
                <div className="text-3xl text-silk" style={{ fontWeight: 300 }}>
                  {formatKES(tier.price)}
                </div>
                {currency && rate && (
                  <div className="text-mist/50 text-xs mt-1">
                    ≈ {formatConverted(tier.price, rate, currency)}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-mist text-sm leading-relaxed">
                    <span className="text-gold mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setBookingSelection({ categoryTitle: category.title, tier })}
                className={`relative overflow-hidden label-text px-6 py-3.5 w-full transition-colors duration-400 group ${tier.highlight ? "bg-gold !text-void" : "border border-gold/40 text-gold hover:!text-void"
                  }`}
              >
                <span className="relative z-10 transition-colors duration-400 group-hover:!text-void">
                  Book This Package
                </span>
                {!tier.highlight && (
                  <span className="absolute inset-0 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="section-reveal text-center mt-16">
          <p className="text-mist/50 text-xs mb-4">
            Don&apos;t see a fit? Every package can be customised — including the price.
          </p>
          <button
            onClick={() => setBookingSelection({ categoryTitle: "Custom Enquiry", tier: null })}
            className="label-text text-[0.65rem] text-gold border-b border-gold/40 pb-1 hover:border-gold transition-colors"
          >
            Talk To Us About a Custom Package →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {bookingSelection && (
          <BookingModal
            categoryTitle={bookingSelection.categoryTitle}
            tier={bookingSelection.tier}
            onClose={() => setBookingSelection(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}