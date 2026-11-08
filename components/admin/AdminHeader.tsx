import SignOutButton from "./SignOutButton";
import AdminNav from "./AdminNav";

const link =
  "text-xs uppercase tracking-widest text-mist hover:text-[#E8610A] transition-colors";

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#E8610A] mb-1">Admin</p>
          <h1 className="text-3xl" style={{ fontFamily: "Georgia, serif" }}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" target="_blank" rel="noopener noreferrer" className={link}>
            View site ↗
          </a>
          <SignOutButton />
        </div>
      </div>
      <AdminNav />
    </header>
  );
}
