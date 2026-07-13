import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="tile-motif flex min-h-screen items-center justify-center bg-[#f6f1e7] px-5 text-center"
    >
      <div className="max-w-xl border border-[#d8cdbd] bg-[#f6f1e7] p-10 sm:p-14">
        <p className="font-architectural text-xs tracking-[0.22em] text-[#806839]">
          404 · NOT FOUND
        </p>
        <h1 className="font-display mt-5 text-6xl leading-none text-[#263d32]">
          This detail is not on the plan.
        </h1>
        <p className="mt-5 leading-7 text-[#666861]">
          The page may have moved, or the address may be incomplete.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="size-4" /> Return home
          </Link>
        </Button>
      </div>
    </main>
  );
}
