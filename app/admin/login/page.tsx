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
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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

/* Crop mark, like the corners of a viewfinder or a contact sheet */
function Corner({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-5 w-5 border-[#E8610A]/70 ${className}`}
    />
  );
}

const inputClass =
  "w-full rounded-sm border border-white/15 bg-[#101014] px-4 py-3 text-[15px] text-[#f5f0ea] " +
  "caret-[#E8610A] placeholder:text-white/25 outline-none transition-colors " +
  "hover:border-white/30 focus:border-[#E8610A] focus-visible:ring-2 focus-visible:ring-[#E8610A]/30 " +
  "disabled:opacity-60";

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
        return; // keep the password so a typo is easy to fix
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
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060608] px-6 text-[#f5f0ea]"
      style={{ colorScheme: "dark" }}
    >
      {/* Browsers paint autofilled inputs light blue/white; keep them on theme */}
      <style>{`
        .login-input:-webkit-autofill,
        .login-input:-webkit-autofill:hover,
        .login-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f5f0ea;
          caret-color: #E8610A;
          -webkit-box-shadow: 0 0 0 1000px #101014 inset;
          box-shadow: 0 0 0 1000px #101014 inset;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* Darkroom safelight glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[620px] w-[620px] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, #E8610A 0%, transparent 70%)" }}
      />

      <form
        onSubmit={handleSubmit}
        aria-describedby={error ? errorId : undefined}
        className="relative w-full max-w-md px-9 py-10"
      >
        <Corner className="left-0 top-0 border-l border-t" />
        <Corner className="right-0 top-0 border-r border-t" />
        <Corner className="bottom-0 left-0 border-b border-l" />
        <Corner className="bottom-0 right-0 border-b border-r" />

        <h1 className="text-3xl leading-tight" style={{ fontFamily: "Georgia, serif" }}>
          Portfolio admin
        </h1>
        <p className="mt-2 mb-8 text-sm text-white/50">
          Sign in to manage your photographs and galleries.
        </p>

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
              className={`login-input ${inputClass}`}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor={passwordId} className="text-sm text-white/70">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="flex items-center gap-1.5 rounded-sm px-1 py-0.5 text-xs text-white/70 transition-colors hover:text-[#E8610A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8610A]/50"
              >
                <EyeIcon off={showPassword} />
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>
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
              className={`login-input ${inputClass}`}
            />
            {capsLock && (
              <p className="mt-1.5 text-xs text-amber-300/90">Caps Lock is on.</p>
            )}
          </div>
        </div>

        <div id={errorId} role="alert" aria-live="polite" className="min-h-[3.5rem] pt-4">
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