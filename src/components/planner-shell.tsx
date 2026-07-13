"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookImage,
  CalendarClock,
  CheckSquare2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  NotebookPen,
  Settings,
  Sparkles,
  Store,
  UsersRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { couple } from "@/lib/demo-data";
import { cn, initials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { slug: "overview", label: "Overview", icon: Home },
  { slug: "checklist", label: "Checklist", icon: CheckSquare2 },
  { slug: "timeline", label: "Timeline", icon: CalendarClock },
  { slug: "budget", label: "Budget", icon: CircleDollarSign },
  { slug: "guests", label: "Guests", icon: UsersRound },
  { slug: "vendors", label: "Vendors", icon: Store },
  { slug: "inspiration", label: "Inspiration", icon: BookImage },
  { slug: "venue", label: "Venue Planning", icon: Sparkles },
  { slug: "notes", label: "Notes", icon: NotebookPen },
  { slug: "documents", label: "Documents", icon: FileText },
  { slug: "team", label: "Padua Team", icon: MessageSquareText, booked: true },
  {
    slug: "final-details",
    label: "Final Details",
    icon: ClipboardCheck,
    booked: true,
  },
  { slug: "settings", label: "Settings", icon: Settings },
];

export function PlannerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);

  const signOut = async () => {
    await createClient()?.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-[#3c5145] bg-[#263d32] text-white lg:flex">
        <div className="border-b border-white/10 px-7 py-7">
          <Link href="/planning/overview">
            <span className="font-architectural block text-[10px] tracking-[0.28em] text-[#d9c396]">
              PADUA
            </span>
            <span className="font-display text-xl">Wedding Planning</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Planning">
          {nav.map(({ slug, label, icon: Icon }) => {
            const active = pathname.endsWith(`/${slug}`);
            return (
              <Link
                key={slug}
                href={`/planning/${slug}`}
                className={cn(
                  "mb-0.5 flex min-h-10 items-center gap-3 border-l-2 px-4 text-[13px] font-medium transition-colors",
                  active
                    ? "border-[#b4935a] bg-white/10 text-white"
                    : "border-transparent text-[#cfd6d0] hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-[17px]" strokeWidth={1.7} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            className="flex w-full items-center gap-3 p-2 text-left"
            onClick={() => router.push("/planning/settings")}
          >
            <span className="flex size-9 items-center justify-center bg-[#b4935a] text-xs font-bold text-[#263d32]">
              {initials(couple.names)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {couple.names}
              </span>
              <span className="block text-[11px] text-[#aeb8b0]">
                {couple.bookingStatus}
              </span>
            </span>
            <ChevronDown className="size-4 text-[#aeb8b0]" />
          </button>
          <button
            onClick={signOut}
            className="mt-2 flex min-h-9 w-full items-center gap-3 px-3 text-xs text-[#bfc8c1] hover:text-white"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-[#d8cdbd] bg-[#f6f1e7]/95 px-5 backdrop-blur-sm lg:hidden">
          <Link href="/planning/overview">
            <span className="font-architectural block text-[9px] tracking-[0.25em] text-[#806839]">
              PADUA
            </span>
            <span className="font-display text-lg text-[#263d32]">
              Wedding Planning
            </span>
          </Link>
          <Button
            variant="quiet"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setDrawer(true)}
          >
            <Menu className="size-5" />
          </Button>
        </header>
        <main
          id="main-content"
          className="mx-auto max-w-[1440px] px-4 pb-28 pt-7 sm:px-7 lg:px-10 lg:pb-12 lg:pt-9"
        >
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#d8cdbd] bg-[#fffdfa] px-1 pb-[max(5px,env(safe-area-inset-bottom))] lg:hidden"
        aria-label="Quick planning navigation"
      >
        {nav.slice(0, 4).map(({ slug, label, icon: Icon }) => (
          <Link
            key={slug}
            href={`/planning/${slug}`}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold",
              pathname.endsWith(`/${slug}`)
                ? "text-[#a65f45]"
                : "text-[#596059]",
            )}
          >
            <Icon className="size-5" /> {label}
          </Link>
        ))}
        <button
          onClick={() => setDrawer(true)}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold text-[#596059]"
        >
          <Menu className="size-5" /> More
        </button>
      </nav>

      {drawer && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Planning navigation"
        >
          <button
            className="absolute inset-0 bg-[#17231e]/70"
            aria-label="Close navigation"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute inset-y-0 right-0 w-[min(88vw,380px)] overflow-y-auto bg-[#f6f1e7] p-5">
            <div className="mb-5 flex items-center justify-between border-b border-[#d8cdbd] pb-5">
              <div>
                <p className="font-display text-2xl text-[#263d32]">
                  {couple.names}
                </p>
                <p className="text-xs text-[#6b6d67]">{couple.bookingStatus}</p>
              </div>
              <Button
                variant="quiet"
                size="icon"
                aria-label="Close navigation"
                onClick={() => setDrawer(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <nav className="grid gap-1">
              {nav.map(({ slug, label, icon: Icon }) => (
                <Link
                  key={slug}
                  href={`/planning/${slug}`}
                  onClick={() => setDrawer(false)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 border-l-2 px-4 text-sm font-semibold",
                    pathname.endsWith(`/${slug}`)
                      ? "border-[#a65f45] bg-white text-[#263d32]"
                      : "border-transparent text-[#555b55]",
                  )}
                >
                  <Icon className="size-5" /> {label}
                </Link>
              ))}
            </nav>
            <Button
              variant="secondary"
              className="mt-7 w-full"
              onClick={signOut}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
