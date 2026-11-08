"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items: { href: string; label: string; match: (p: string) => boolean }[] = [
  {
    href: "/admin",
    label: "Portfolio",
    match: (p) =>
      p === "/admin" ||
      (p.startsWith("/admin/projects/") &&
        !p.startsWith("/admin/projects/new") &&
        !p.startsWith("/admin/projects/bulk")),
  },
  { href: "/admin/projects/new", label: "Add one", match: (p) => p.startsWith("/admin/projects/new") },
  { href: "/admin/projects/bulk", label: "Bulk upload", match: (p) => p.startsWith("/admin/projects/bulk") },
  { href: "/admin/hero", label: "Hero", match: (p) => p.startsWith("/admin/hero") },
  { href: "/admin/categories", label: "Categories", match: (p) => p.startsWith("/admin/categories") },
];

export default function AdminNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/10">
      {items.map((it) => {
        const active = it.match(pathname);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`text-xs uppercase tracking-widest pb-3 -mb-px border-b-2 transition-colors ${
              active
                ? "text-[#E8610A] border-[#E8610A]"
                : "text-mist border-transparent hover:text-[#f5f0ea]"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
