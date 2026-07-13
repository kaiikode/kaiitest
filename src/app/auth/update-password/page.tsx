"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Field, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-[#f6f1e7] px-5"
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (password.length < 8)
            return setError("Use at least 8 characters.");
          if (password !== confirm) return setError("Passwords do not match.");
          setLoading(true);
          const supabase = createClient();
          if (!supabase) {
            toast.success("Demo password updated.");
            router.push("/planning/overview");
            return;
          }
          const { error: authError } = await supabase.auth.updateUser({
            password,
          });
          setLoading(false);
          if (authError) setError(authError.message);
          else {
            toast.success("Password updated.");
            router.push("/planning/overview");
          }
        }}
        className="w-full max-w-md border border-[#d8cdbd] bg-white p-7 sm:p-9"
      >
        <p className="font-architectural text-xs tracking-[0.2em] text-[#806839]">
          SECURE ACCESS
        </p>
        <h1 className="font-display mt-3 text-5xl leading-none text-[#263d32]">
          Choose a new password
        </h1>
        <div className="mt-7 grid gap-5">
          <Field label="New password">
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <Field label="Confirm password" error={error}>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </div>
      </form>
    </main>
  );
}
