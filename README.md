# Legacy Pixels — Photography & Videography Portfolio

A cinematic, dark-luxury Next.js portfolio website for the **Legacy Pixels** studio, featuring interactive 3D animations, smooth scrolling, custom cursor, and a filterable portfolio grid.

---

## 🎬 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D Engine | React Three Fiber + Drei |
| Animations | Framer Motion + GSAP |
| Smooth Scroll | Lenis |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## ✨ Features

- **3D Hero Scene** — Interactive camera model with orbiting rings and particle field; responds to mouse movement
- **Floating Aperture** — Animated aperture blade assembly in the Services section
- **Custom Cursor** — Dual-layer dot/ring cursor with hover morphing
- **Film Grain Overlay** — Animated noise texture for cinematic feel
- **Filterable Portfolio Grid** — Animated category filter with Framer Motion layout transitions
- **Smooth Scrolling** — Lenis-powered momentum scrolling
- **Accordion Services** — Animated expand/collapse service descriptions
- **Contact Form** — Floating label inputs with gold focus states
- **Responsive** — Mobile-first, works across all screen sizes

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
legacy-pixels/
├── app/
│   ├── globals.css          # Film grain, fonts, base styles
│   ├── layout.tsx           # Root layout with cursor + smooth scroll
│   ├── page.tsx             # Homepage (assembles all sections)
│   ├── portfolio/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── 3d/
│   │   ├── HeroScene.tsx    # Main 3D scene (R3F)
│   │   └── FloatingAperture.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Services.tsx
│   │   └── Contact.tsx
│   └── ui/
│       ├── CustomCursor.tsx
│       └── SmoothScroll.tsx
├── hooks/
│   └── useScrollReveal.ts
├── lib/
│   └── portfolio-data.ts    # All portfolio content
├── public/
│   └── assets/
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--void` | `#060608` — near-black background |
| `--obsidian` | `#0D0D12` — secondary background |
| `--graphite` | `#1A1A22` — card backgrounds |
| `--mist` | `#9B9BAA` — body text |
| `--silk` | `#F0EBE1` — headings |
| `--gold` | `#C9A96E` — primary accent |
| Font Display | Cormorant Garamond (italic, light) |
| Font Body | DM Sans (light, regular) |
| Font Mono | DM Mono |

---

## 📸 Adding Real Photos

1. Replace Unsplash URLs in `lib/portfolio-data.ts` with your own images
2. Place images in `public/assets/portfolio/`
3. Update `src` paths to `/assets/portfolio/your-image.jpg`

---

## 🌍 Deployment

Deploy to **Vercel** (recommended):

```bash
npx vercel
```

Or export static:

```bash
npm run build
```

---

*Built for Legacy Pixels Studio — Nairobi, Kenya*
