import Link from "next/link";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const links = [
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-20">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex flex-col leading-none mb-6">
              <span
                className="text-4xl text-silk"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                Legacy
              </span>
              <span className="label-text text-[0.55rem] tracking-[0.35em]">
                Pixels Studio
              </span>
            </div>
            <p className="text-mist text-sm leading-relaxed font-light">
              Visual storytelling through the lens. We craft images and films
              that outlast the moment.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-20">
            <div>
              <p className="label-text mb-6 text-xs">Navigate</p>
              <ul className="flex flex-col gap-4">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-mist hover:text-gold text-sm transition-colors duration-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-text mb-6 text-xs">Social</p>
              <ul className="flex flex-col gap-4">
                {socials.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className="text-mist hover:text-gold text-sm transition-colors duration-300 flex items-center gap-2 group"
                    >
                      {s.label}
                      <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-sm">
            <p className="label-text mb-4 text-xs">Start a project</p>
            <p className="text-silk text-3xl mb-8 leading-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
              Let&apos;s create something unforgettable.
            </p>
            <Link
              href="/contact"
              className="relative overflow-hidden border border-gold/40 text-gold hover:text-void transition-colors duration-400 label-text px-8 py-3 inline-block group"
            >
              <span className="relative z-10">Get in Touch</span>
              <span className="absolute inset-0 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-line mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-mist/50 text-xs font-mono">
            © {new Date().getFullYear()} Legacy Pixels Studio. All rights reserved.
          </p>
          <p className="text-mist/30 text-xs font-mono">
            Nairobi, Kenya — Available worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
