"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Work", href: "/#portfolio" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Packages", href: "/#packages" },

  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-void/80 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
          }`}
      >
        <nav className="max-w-screen-xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span
              className="display-text text-2xl text-silk group-hover:text-gold transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              Legacy
            </span>
            <span
              className="label-text text-[0.55rem] tracking-[0.35em]"
              style={{ color: "var(--gold)" }}
            >
              Pixels Studio
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="label-text text-mist hover:text-gold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/contact"
              className="relative overflow-hidden border border-gold/40 text-gold hover:text-void transition-colors duration-400 label-text px-6 py-2.5 group"
            >
              <span className="relative z-10">Book a Session</span>
              <span className="absolute inset-0 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-px w-6 bg-silk transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-gold transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-silk transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-void/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="display-text text-5xl text-silk hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/#packages"
                onClick={() => setMenuOpen(false)}
                className="border border-gold text-gold label-text px-8 py-3"
              >
                Book a Session
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
