"use client";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-[#263d32] px-5 text-center text-white"
    >
      <div className="max-w-xl">
        <p className="font-architectural text-xs tracking-[0.22em] text-[#d9c396]">
          A PAUSE IN THE PLAN
        </p>
        <h1 className="font-display mt-5 text-6xl">
          This page needs another moment.
        </h1>
        <p className="mt-5 leading-7 text-[#d5ddd7]">
          Your saved planning details are safe. Try the page again, or return to
          your overview.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={reset}
            className="border-white bg-white text-[#263d32] hover:bg-[#f6f1e7]"
          >
            Try again
          </Button>
          <Button
            asChild
            variant="secondary"
            className="border-white/40 text-white hover:bg-white/10"
          >
            <Link href="/planning/overview">Return to overview</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
