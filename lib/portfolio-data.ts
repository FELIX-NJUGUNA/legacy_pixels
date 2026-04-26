export type Category = "All" | "Editorial" | "Weddings" | "Commercial" | "Film";

export interface Project {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  year: string;
  image: string;
  aspect: "portrait" | "landscape" | "square";
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "01",
    title: "Golden Hour Reverie",
    category: "Editorial",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    aspect: "portrait",
    tags: ["Nairobi", "Natural Light"],
  },
  {
    id: "02",
    title: "Vows at the Rift",
    category: "Weddings",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    aspect: "landscape",
    tags: ["Naivasha", "Film"],
  },
  {
    id: "03",
    title: "Craft & Obsession",
    category: "Commercial",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    aspect: "square",
    tags: ["Product", "Studio"],
  },
  {
    id: "04",
    title: "Dust & Velocity",
    category: "Film",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    aspect: "landscape",
    tags: ["Short Film", "Cinematic"],
  },
  {
    id: "05",
    title: "Bloom Narrative",
    category: "Editorial",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    aspect: "portrait",
    tags: ["Fashion", "Outdoor"],
  },
  {
    id: "06",
    title: "Infinite Horizons",
    category: "Commercial",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&q=80",
    aspect: "landscape",
    tags: ["Brand", "Travel"],
  },
  {
    id: "07",
    title: "Sacred Silence",
    category: "Weddings",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
    aspect: "portrait",
    tags: ["Intimate", "Documentary"],
  },
  {
    id: "08",
    title: "The Weight of Memory",
    category: "Film",
    year: "2022",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    aspect: "landscape",
    tags: ["Documentary", "Award"],
  },
];

export const services = [
  {
    id: "01",
    title: "Editorial Photography",
    description:
      "Conceptual shoots that push boundaries. Fashion, portrait, and lifestyle imagery crafted for magazines, campaigns, and brands with a unique visual vocabulary.",
    tags: ["Fashion", "Portrait", "Lifestyle", "Campaign"],
  },
  {
    id: "02",
    title: "Wedding Films & Photography",
    description:
      "Your story told with cinematic depth and intimate detail. From documentary-style coverage to fully produced films that become heirlooms.",
    tags: ["Documentary", "Cinematic", "Photo + Film", "Destination"],
  },
  {
    id: "03",
    title: "Commercial & Brand",
    description:
      "Visual content that sells — product photography, brand films, social media campaigns, and corporate documentation that communicates with clarity and beauty.",
    tags: ["Product", "Brand Film", "Corporate", "Social"],
  },
  {
    id: "04",
    title: "Short & Documentary Film",
    description:
      "Narrative filmmaking from concept to color grade. We produce short films, documentaries, and music videos that demand attention.",
    tags: ["Narrative", "Documentary", "Music Video", "Color Grade"],
  },
];
