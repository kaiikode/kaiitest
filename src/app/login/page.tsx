"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button, Field, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

type Mode = "signin" | "signup" | "magic" | "reset";
const emailSchema = z.email("Enter a valid email address.");

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("olivia@example.com");
  const [password, setPassword] = useState("padua-demo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    if ((mode === "signin" || mode === "signup") && password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }

    setError("");
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      await new Promise((resolve) => setTimeout(resolve, 550));
      toast.success(
        mode === "magic" || mode === "reset"
          ? "Demo mode: email delivery is simulated."
          : "Welcome back to your planning space.",
      );
      if (mode === "signin" || mode === "signup") {
        if (mode === "signup") track("account_created");
        router.push(search.get("next") ?? "/planning/overview");
      }
      setLoading(false);
      return;
    }

    if (mode === "signin") {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) setError(authError.message);
      else router.push(search.get("next") ?? "/planning/overview");
    } else if (mode === "signup") {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) setError(authError.message);
      else {
        track("account_created");
        toast.success("Check your email to confirm your account.");
      }
    } else if (mode === "magic") {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) setError(authError.message);
      else toast.success("Your secure sign-in link is on its way.");
    } else {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );
      if (authError) setError(authError.message);
      else toast.success("Password reset instructions sent.");
    }
    setLoading(false);
  };

  const title = {
    signin: "Return to your plans",
    signup: "Create your private space",
    magic: "Sign in without a password",
    reset: "Reset your password",
  }[mode];

  return (
    <main
      id="main-content"
      className="grid min-h-screen bg-[#f6f1e7] lg:grid-cols-2"
    >
      <section className="flex flex-col px-5 py-7 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-[#445047]"
        >
          <ArrowLeft className="size-4" /> Padua Wedding Planning
        </Link>
        <div className="mx-auto my-auto w-full max-w-md py-16">
          <p className="font-architectural text-xs tracking-[0.2em] text-[#806839]">
            PRIVATE ACCESS
          </p>
          <h1 className="font-display mt-4 text-5xl leading-none text-[#263d32]">
            {title}
          </h1>
          <p className="mt-5 leading-7 text-[#66665f]">
            {mode === "signup"
              ? "Start with what you know. Your plan can change as decisions become clearer."
              : "Your checklist, decisions and Padua details are waiting."}
          </p>

          {(mode === "signin" || mode === "signup") && (
            <div className="mt-8 grid grid-cols-2 border border-[#bdb2a3] p-1">
              <button
                onClick={() => setMode("signin")}
                className={`min-h-10 text-sm font-semibold ${mode === "signin" ? "bg-[#263d32] text-white" : "text-[#50564f]"}`}
              >
                Sign in
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`min-h-10 text-sm font-semibold ${mode === "signup" ? "bg-[#263d32] text-white" : "text-[#50564f]"}`}
              >
                Create account
              </button>
            </div>
          )}

          <form className="mt-7 grid gap-5" onSubmit={submit} noValidate>
            <Field label="Email address" error={error}>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            {(mode === "signin" || mode === "signup") && (
              <Field label="Password">
                <Input
                  type="password"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
            )}
            <Button type="submit" disabled={loading}>
              {loading
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in securely"
                  : mode === "signup"
                    ? "Create account"
                    : mode === "magic"
                      ? "Send magic link"
                      : "Send reset instructions"}
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {mode !== "magic" && (
              <button
                onClick={() => {
                  setError("");
                  setMode("magic");
                }}
                className="font-semibold text-[#506554] hover:underline"
              >
                <Mail className="mr-1 inline size-4" /> Use a magic link
              </button>
            )}
            {mode !== "reset" && (
              <button
                onClick={() => {
                  setError("");
                  setMode("reset");
                }}
                className="font-semibold text-[#506554] hover:underline"
              >
                Forgot password?
              </button>
            )}
            {(mode === "magic" || mode === "reset") && (
              <button
                onClick={() => {
                  setError("");
                  setMode("signin");
                }}
                className="font-semibold text-[#506554] hover:underline"
              >
                Back to password sign in
              </button>
            )}
          </div>
          <p className="mt-8 border-t border-[#d8cdbd] pt-6 text-xs leading-5 text-[#70716a]">
            Demo access is enabled until Supabase credentials are configured.
            Your production session uses secure, HTTP-only cookie handling.
          </p>
        </div>
      </section>
      <aside className="tile-motif relative hidden overflow-hidden bg-[#263d32] lg:block">
        <div className="arch absolute bottom-0 left-[15%] h-[82%] w-[70%] border-[16px] border-white/10 bg-[#334f40]">
          <div className="arch absolute bottom-0 left-1/2 h-[73%] w-[62%] -translate-x-1/2 bg-[#202f28]">
            <div className="absolute bottom-20 left-1/2 size-36 -translate-x-1/2 rounded-full border border-[#b4935a]/60" />
          </div>
        </div>
      </aside>
    </main>
  );
}
