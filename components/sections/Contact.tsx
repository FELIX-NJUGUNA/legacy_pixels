"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClasses = (name: string) =>
    `w-full bg-transparent border-b py-4 text-sm text-silk placeholder:text-mist/30 outline-none transition-all duration-300 ${
      focused === name ? "border-gold" : "border-white/10"
    }`;

  const contactItems = [
    { Icon: Mail, label: "Email", value: "hello@legacypixels.co.ke" },
    { Icon: MapPin, label: "Location", value: "Nairobi, Kenya" },
    { Icon: Clock, label: "Response Time", value: "Within 24 hours" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 px-6 md:px-12 max-w-screen-xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-24">
        {/* Left */}
        <div className="section-reveal">
          <p className="label-text mb-6">Let&apos;s Talk</p>
          <h2 className="display-text text-[clamp(2.5rem,5vw,4.5rem)] text-silk leading-[0.92] mb-10">
            Start a Conversation
          </h2>
          <p className="text-mist text-sm leading-relaxed mb-12 max-w-sm">
            Tell us about your project, your vision, your deadline. We respond
            within 24 hours and love a good brief.
          </p>

          <div className="space-y-8">
            {contactItems.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-gold/30 text-gold mt-0.5 shrink-0">
                  <Icon size={15} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="label-text text-[0.6rem] text-mist/40 mb-1">
                    {label}
                  </p>
                  <p className="text-silk text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="section-reveal">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    required
                    className={inputClasses("fname")}
                    onFocus={() => setFocused("fname")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    required
                    className={inputClasses("lname")}
                    onFocus={() => setFocused("lname")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <input
                type="email"
                placeholder="Email address"
                required
                className={inputClasses("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />

              <select
                className={`${inputClasses("service")} appearance-none`}
                onFocus={() => setFocused("service")}
                onBlur={() => setFocused(null)}
              >
                <option value="" className="bg-obsidian">
                  Select a service
                </option>
                <option value="editorial" className="bg-obsidian">
                  Editorial Photography
                </option>
                <option value="wedding" className="bg-obsidian">
                  Wedding Film & Photography
                </option>
                <option value="commercial" className="bg-obsidian">
                  Commercial & Brand
                </option>
                <option value="film" className="bg-obsidian">
                  Short & Documentary Film
                </option>
              </select>

              <textarea
                placeholder="Tell us about your project..."
                rows={4}
                className={`${inputClasses("message")} resize-none`}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
              />

              <button
                type="submit"
                className="relative overflow-hidden border border-gold text-gold hover:text-void transition-colors duration-400 label-text px-10 py-4 w-full group"
              >
                <span className="relative z-10">Send Message →</span>
                <span className="absolute inset-0 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col justify-center items-start py-20"
            >
              <div className="w-12 h-px bg-gold mb-8" />
              <h3
                className="display-text text-4xl text-silk mb-4"
                style={{ fontWeight: 300 }}
              >
                Message Sent.
              </h3>
              <p className="text-mist text-sm">
                We&apos;ll be in touch within 24 hours. In the meantime, explore
                our portfolio.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}