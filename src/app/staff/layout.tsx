import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["staff", "administrator"]);
  return (
    <div className="min-h-screen bg-[#f4f0e8]">
      <header className="bg-[#263d32] text-white">
        <div className="mx-auto flex min-h-20 max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <Link href="/staff" className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-[#d9c396]" />
            <span>
              <span className="font-architectural block text-[9px] tracking-[0.22em] text-[#d9c396]">
                PADUA OPERATIONS
              </span>
              <span className="font-display text-xl">Couple Care</span>
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/staff">Couples</Link>
            {user.role === "administrator" && (
              <Link href="/admin">Administration</Link>
            )}
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
