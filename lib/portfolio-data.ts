export type Category = "All" | "Street Photography" | "Weddings" | "Graduation" | "Creative Works" | "Picnics" | "Studio Works";

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  year: string;
  image: string;
  aspect: "portrait" | "landscape" | "square";
  tags: string[];
}

export type PackageTier = {
  id: string;
  name: string;
  price: number; // in KES
  features: string[];
  highlight?: boolean;
};

export type PackageCategory = {
  id: string;
  title: string;
  blurb: string;
  tiers: PackageTier[];
};


export const projects: Project[] = [
  {
    id: "01",
    title: "Golden Hour Reverie",
    category: "Street Photography",
    year: "2024",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676878/LEGACY_4700_y2bcyl.jpg",
    aspect: "portrait",
    tags: ["Nairobi", "Natural Light"],
  },
  {
    id: "02",
    title: "Vows at the Rift",
    category: "Weddings",
    year: "2024",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783668867/LEGACY_1093_rdeyes.jpg",
    aspect: "landscape",
    tags: ["Naivasha", "Film"],
  },
  {
    id: "03",
    title: "Craft & Obsession",
    category: "Graduation",
    year: "2024",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676888/LEGACY_9413_w2vlln.jpg",
    aspect: "square",
    tags: ["Product", "Studio"],
  },
  {
    id: "04",
    title: "Dust & Velocity",
    category: "Creative Works",
    year: "2023",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676891/LEGACY_2722_k4i4al.jpg",
    aspect: "landscape",
    tags: ["Short Film", "Cinematic"],
  },
  {
    id: "05",
    title: "Bloom Narrative",
    category: "Picnics",
    year: "2023",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676862/LEGACY_0995_osolx4.jpg",
    aspect: "portrait",
    tags: ["Fashion", "Outdoor"],
  },
  {
    id: "06",
    title: "Infinite Horizons",
    category: "Studio Works",
    year: "2023",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676897/LEGACY_2858_tpfehk.jpg",
    aspect: "landscape",
    tags: ["Brand", "Travel"],
  },
  {
    id: "07",
    title: "Sacred Silence",
    category: "Weddings",
    year: "2023",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783668867/LEGACY_1149_lqonyx.jpg",
    aspect: "portrait",
    tags: ["Intimate", "Documentary"],
  },
  {
    id: "08",
    title: "The Weight of Memory",
    category: "Creative Works",
    year: "2022",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676891/LEGACY_9803_p2d3st.jpg",
    aspect: "landscape",
    tags: ["Documentary", "Award"],
  },
    {
    id: "09",
    title: "Blissful Embrace",
    category: "Street Photography",
    year: "2022",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676877/LEGACY_5896_xowiir.jpg",
    aspect: "landscape",
    tags: ["Silhoutte", "Award"],
  },
    {
    id: "10",
    title: "Serenity",
    category: "Picnics",
    year: "2022",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676862/LEGACY_0996_r8udzg.jpg",
    aspect: "landscape",
    tags: ["Chilling", "Vybes"],
  },

  {
    id: "11",
    title: "Serenity",
    category: "Studio Works",
    year: "2022",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676899/LEGACY_1637_oo9v59.jpg",
    aspect: "landscape",
    tags: ["Chilling", "Vybes"],
  },

    {
    id: "12",
    title: "Serenity",
    category: "Graduation",
    year: "2022",
    image:
      "https://res.cloudinary.com/drf22orgz/image/upload/v1783676887/LEGACY_9803_b4dzmt.jpg",
    aspect: "landscape",
    tags: ["Chilling", "Vybes"],
  },



];


export const packageCategories: PackageCategory[] = [
  {
    id: "outdoor",
    title: "Outdoor Photography",
    blurb: "On-location shoots — a park, the street, or a spot you have in mind.",
    tiers: [
      {
        id: "bronze",
        name: "Bronze",
        price: 3000,
        features: [
          "Location: client's choice",
          "10 high-res edited photos",
          "1 hour shoot",
          "Unlimited outfit changes",
          "Turnaround: 24–48 hours",
        ],
      },
      {
        id: "silver",
        name: "Silver",
        price: 5000,
        highlight: true,
        features: [
          "Location: client's choice",
          "15 high-res edited photos",
          "A3 mount included",
          "1–2 hour shoot",
          "Unlimited outfit changes",
          "Turnaround: 24–48 hours",
        ],
      },
      {
        id: "gold",
        name: "Gold",
        price: 9000,
        features: [
          "Location: client's choice",
          "20 high-res edited photos",
          "A3 mount/frame",
          "Flower bouquet included",
          "Full glam make-up",
          "3–4 hour shoot",
          "Unlimited outfit changes",
          "Turnaround: 24–48 hours",
        ],
      },
    ],
  },
  {
    id: "studio",
    title: "Studio / Indoor Photography",
    blurb: "State-of-the-art studio sessions — fun, artistic, and elegant.",
    tiers: [
      {
        id: "mini",
        name: "Mini Pack",
        price: 3500,
        features: [
          "1 hour shoot",
          "5–10 high-res edited photos",
          "3 outfit changes",
          "Turnaround: 24–48 hours",
        ],
      },
      {
        id: "mid",
        name: "Mid Pack",
        price: 7500,
        highlight: true,
        features: [
          "2–3 hour shoot",
          "15–20 high-res edited photos",
          "A3 mount/frame",
          "Unlimited outfit changes",
          "Turnaround: 24–48 hours",
        ],
      },
      {
        id: "max",
        name: "Max Pack",
        price: 12000,
        features: [
          "2–3 hour shoot",
          "25–30 high-res edited photos",
          "Access to raw, unedited files",
          "A3 mount/frame",
          "Unlimited outfit changes",
          "Full glam make-up",
          "Turnaround: 24–48 hours",
          "No hidden charges",
        ],
      },
    ],
  },
  {
    id: "event",
    title: "Event Photography & Videography",
    blurb:
      "Premium event coverage, captured with elegance and precision — built to be relived for years.",
    tiers: [
      {
        id: "basic",
        name: "Basic Package",
        price: 50000,
        features: [
          "9x2 photobook, 40 pages",
          "Unlimited photos (delivered via drive)",
          "A2 mount or frame",
          "1 photographer, 1 videographer",
          "Edited videos on a free flash disk",
          "Up to 8 hours coverage",
        ],
      },
      {
        id: "standard",
        name: "Standard Package",
        price: 100000,
        highlight: true,
        features: [
          "10x10 photobook, 40 pages",
          "Unlimited photos (delivered via drive)",
          "A2 mount or frame",
          "2 photographers, 2 videographers",
          "Edited videos on a free flash disk",
          "Drone photos and videos",
          "Free shorts and reels",
          "Up to 8 hours coverage",
        ],
      },
      {
        id: "premium",
        name: "Premium Package",
        price: 130000,
        features: [
          "12x12 leather photobook, 40 pages",
          "Unlimited photos (delivered via drive)",
          "A1 mount or frame",
          "2 photographers, 2 videographers",
          "Edited videos on a free flash disk",
          "Drone photos and videos",
          "Free shorts and reels",
          "3-minute highlight trailer",
          "Up to 8 hours coverage",
        ],
      },
    ],
  },
];

export const services = [
  {
    id: "01",
    title: "Photography",
    description:
      "From candid event coverage to polished studio portraits, we capture people, products, and moments with intention — indoors, outdoors, or wherever the story calls us.",
    tags: ["Event", "Outdoor", "Studio", "Products", "Creative"],
  },
  {
    id: "02",
    title: "Videography",
    description:
      "Full-motion storytelling for events, brands, and artists — shot and edited to feel cinematic, whether it's a wedding highlight reel or a product launch film.",
    tags: [
      "Event",
      "Music Video",
      "Studio",
      "Products",
      "Creative",
      "Documentaries",
      "Adverts",
      "Vlogs",
    ],
  },
  {
    id: "03",
    title: "Cinematography",
    description:
      "Mood-driven visual direction for projects that need more than a straightforward shot list — silhouettes, light play, and considered composition.",
    tags: ["Silhouettes", "Mood & Light", "Visual Direction"],
  },
  {
    id: "04",
    title: "Digital Marketing",
    description:
      "We turn your visual content into a strategy — helping your brand show up consistently and intentionally across digital channels.",
    tags: ["Content Strategy", "Campaigns", "Analytics"],
  },
  {
    id: "05",
    title: "Branding",
    description:
      "Visual identity work that gives your business a consistent, recognizable look across every touchpoint — from logo to full brand guidelines.",
    tags: ["Visual Identity", "Brand Guidelines", "Design"],
  },
  {
    id: "06",
    title: "Social Media Strategy",
    description:
      "Content calendars, platform strategy, and creative direction to help your social presence grow with purpose, not just post frequency.",
    tags: ["Content Calendar", "Platform Strategy", "Growth"],
  },
];
