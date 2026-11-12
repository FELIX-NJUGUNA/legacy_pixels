"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NETWORK_ERROR =
  "Can't reach the auth server. Check your connection and Supabase URL.";

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("fetch") || m.includes("network")) return NETWORK_ERROR;
  if (m.includes("invalid login")) return "Email or password is incorrect.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Wait a minute and try again.";
  return message;
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/15 rounded-sm px-4 py-3 text-[15px] " +
  "placeholder:text-white/30 outline-none transition-colors " +
  "hover:border-white/30 focus:border-[#E8610A] focus-visible:ring-2 focus-visible:ring-[#E8610A]/40";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(friendlyError(error.message));
        setPassword("");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#060608] text-[#f5f0ea] px-6">
      {/* Faint ember glow behind the form */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, #E8610A 0%, transparent 70%)" }}
      />

      <form
        onSubmit={handleSubmit}
        noValidate={false}
        aria-describedby={error ? errorId : undefined}
        className="relative w-full max-w-sm"
      >
        <div className="mb-8 border-l-2 border-[#E8610A] pl-4">
          <h1
            className="text-3xl leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Admin sign in
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Use your admin account to manage the site.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor={emailId} className="mb-1.5 block text-sm text-white/70">
              Email
            </label>
            <input
              id={emailId}
              type="email"
              name="email"
              autoComplete="username"
              autoFocus
              inputMode="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor={passwordId} className="mb-1.5 block text-sm text-white/70">
              Password
            </label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                onBlur={() => setCapsLock(false)}
                required
                disabled={loading}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition-colors hover:text-white focus-visible:text-[#E8610A] focus-visible:outline-none"
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {capsLock && (
              <p className="mt-1.5 text-xs text-amber-300/90">Caps Lock is on.</p>
            )}
          </div>
        </div>

        <div id={errorId} role="alert" aria-live="polite" className="min-h-[3rem] pt-4">
          {error && (
            <p className="border-l-2 border-red-400 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-[#E8610A] bg-[#E8610A] py-3 text-sm font-medium text-[#060608] transition-colors hover:bg-transparent hover:text-[#E8610A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8610A]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060608] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#E8610A] disabled:hover:text-[#060608]"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
          )}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}