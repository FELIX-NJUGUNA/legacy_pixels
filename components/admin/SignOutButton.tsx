"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      onClick={signOut}
      className="text-xs uppercase tracking-widest text-mist hover:text-[#E8610A] transition-colors"
    >
      Sign out
    </button>
  );
}