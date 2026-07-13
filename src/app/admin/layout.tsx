import Link from "next/link";
import { Settings2 } from "lucide-react";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["administrator"]);
  return (
    <div className="min-h-screen bg-[#f4f0e8]">
      <header className="bg-[#202f28] text-white">
        <div className="mx-auto flex min-h-20 max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <Link href="/admin" className="flex items-center gap-3">
            <Settings2 className="size-5 text-[#d9c396]" />
            <span>
              <span className="font-architectural block text-[9px] tracking-[0.22em] text-[#d9c396]">
                PADUA PLATFORM
              </span>
              <span className="font-display text-xl">Administration</span>
            </span>
          </Link>
          <nav className="flex gap-5 text-sm font-semibold">
            <Link href="/admin">Platform</Link>
            <Link href="/staff">Staff dashboard</Link>
            <Link href="/planning/overview">Demo workspace</Link>
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10"
      >
        {children}
      </main>
    </div>
  );
}
