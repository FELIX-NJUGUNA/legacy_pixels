import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#060608",
        obsidian: "#0D0D12",
        graphite: "#1A1A22",
        mist: "#9B9BAA",
        silk: "#F0EBE1",
        gold: "#E8610A",        // was #C9A96E  ← main accent
        "gold-light": "#FF8C3B", // was #E8D5A3  ← hover / highlights  
        "gold-dark": "#A84200",  // was #8B6E3F  ← darker shade
        ember: "#FF4500",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "grain": "grain 0.5s steps(1) infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(2%, -1%)" },
          "50%": { transform: "translate(-3%, 3%)" },
          "60%": { transform: "translate(4%, -2%)" },
          "70%": { transform: "translate(-2%, 1%)" },
          "80%": { transform: "translate(1%, -4%)" },
          "90%": { transform: "translate(3%, 2%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
