"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { differenceInCalendarDays, format } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card } from "@/components/ui";
import { couple, initialBudget, initialTasks } from "@/lib/demo-data";
import { currency } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

type Onboarding = {
  partnerOne?: string;
  partnerTwo?: string;
  bookingStatus?: string;
  guestCount?: number;
  budget?: number;
  weddingDate?: string;
};

export function OverviewSection() {
  const search = useSearchParams();
  const [profile, setProfile] = useState<Onboarding>({});

  useEffect(() => {
    let timeoutId: number | undefined;
    const saved = localStorage.getItem("padua-onboarding");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Onboarding;
        timeoutId = window.setTimeout(() => setProfile(parsed), 0);
      } catch {
        localStorage.removeItem("padua-onboarding");
      }
    }
    if (search.get("welcome")) toast.success("Your planning space is ready.");
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const names =
    profile.partnerOne && profile.partnerTwo
      ? `${profile.partnerOne} & ${profile.partnerTwo}`
      : couple.names;
  const weddingDate = profile.weddingDate || couple.weddingDate;
  const countdown = Math.max(
    0,
    differenceInCalendarDays(new Date(`${weddingDate}T12:00:00`), new Date()),
  );
  const completed = initialTasks.filter(
    (task) => task.status === "Completed",
  ).length;
  const actual = initialBudget.reduce((sum, item) => sum + item.actual, 0);
  const target = Number(profile.budget) || couple.targetBudget;

  return (
    <>
      <SectionHeading
        eyebrow="MONDAY, JULY 13"
        title={`Welcome, ${names}`}
        description="Here is the clearest view of what is decided, what is approaching, and where a little attention will help most."
        action={
          <Button asChild variant="secondary">
            <Link href="/planning/team">
              <MessageSquareText className="size-4" /> Contact Padua
            </Link>
          </Button>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="relative overflow-hidden bg-[#263d32] p-6 text-white sm:p-8">
          <div className="tile-motif absolute inset-0 opacity-20" />
          <div className="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Badge tone="gold">
                {profile.bookingStatus || couple.bookingStatus}
              </Badge>
              <p className="font-architectural mt-7 text-[10px] tracking-[0.22em] text-[#d9c396]">
                YOUR WEDDING
              </p>
              <h2 className="font-display mt-2 text-4xl sm:text-5xl">
                {format(new Date(`${weddingDate}T12:00:00`), "MMMM d, yyyy")}
              </h2>
              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#d7ded8]">
                <span className="flex items-center gap-2">
                  <UsersRound className="size-4 text-[#d9c396]" />{" "}
                  {profile.guestCount || couple.guestCount} guests
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#d9c396]" />{" "}
                  {couple.ceremonyStyle}
                </span>
              </div>
            </div>
            <div className="border-l border-white/20 pl-6 sm:text-right">
              <p className="font-display text-6xl text-[#f6f1e7]">
                {countdown}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#bfc9c1]">
                days to go
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6f715e]">
            Overall progress
          </p>
          <div className="mt-4 flex items-end justify-between">
            <p className="font-display text-5xl text-[#263d32]">42%</p>
            <p className="text-xs text-[#6c6e68]">
              {completed} key tasks complete
            </p>
          </div>
          <div
            className="mt-5 h-2 bg-[#e5ded2]"
            role="progressbar"
            aria-label="Planning completion"
            aria-valuenow={42}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full w-[42%] bg-[#7d8b72]" />
          </div>
          <p className="mt-5 text-sm leading-6 text-[#5d615d]">
            You are on pace. Photography is the next decision with the most
            downstream impact.
          </p>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3 text-[#6d746c]">
            <UsersRound className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.13em]">
              Guest count
            </span>
          </div>
          <p className="font-display mt-4 text-4xl text-[#263d32]">
            {profile.guestCount || couple.guestCount}
          </p>
          <p className="mt-1 text-xs text-[#72736d]">
            5 guests organized so far
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 text-[#6d746c]">
            <WalletCards className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.13em]">
              Budget committed
            </span>
          </div>
          <p className="font-display mt-4 text-4xl text-[#263d32]">
            {currency(actual)}
          </p>
          <p className="mt-1 text-xs text-[#72736d]">
            of {currency(target)} target
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 text-[#6d746c]">
            <CheckCircle2 className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.13em]">
              Next deadline
            </span>
          </div>
          <p className="font-display mt-4 text-2xl text-[#263d32]">
            Confirm photographer
          </p>
          <p className="mt-1 text-xs text-[#72736d]">Due August 2</p>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6e705f]">
                Recommended next action
              </p>
              <h2 className="font-display mt-2 text-3xl text-[#263d32]">
                Make the photography decision
              </h2>
            </div>
            <span className="hidden size-12 items-center justify-center border border-[#d8cdbd] text-[#a65f45] sm:flex">
              <ArrowRight className="size-5" />
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#60625c]">
            Confirming coverage now protects your preferred team and helps shape
            the wedding-day timeline around light, portraits, and guest flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/planning/vendors">Review photographer</Link>
            </Button>
            <Button asChild size="sm" variant="quiet">
              <Link href="/planning/checklist">See related tasks</Link>
            </Button>
          </div>
        </Card>
        <Card className="border-l-4 border-l-[#b4935a] p-6">
          <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
            A PADUA PLANNING NOTE
          </p>
          <p className="font-display mt-4 text-2xl leading-7 text-[#263d32]">
            Plan the arrival before the ceremony.
          </p>
          <p className="mt-3 text-sm leading-6 text-[#60625c]">
            Parking, welcome signage, accessibility, and the walk to the
            courtyard set the tone before the processional begins.
          </p>
          <Button asChild variant="quiet" size="sm" className="mt-4 px-0">
            <Link href="/planning/venue">
              Open guest experience <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-[#d8cdbd] px-6 py-5">
            <h2 className="font-display text-2xl text-[#263d32]">
              Upcoming deadlines
            </h2>
            <Button asChild variant="quiet" size="sm">
              <Link href="/planning/checklist">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-[#e2dacf] px-6">
            {initialTasks
              .filter((task) => task.status !== "Completed")
              .slice(0, 3)
              .map((task) => (
                <div key={task.id} className="flex items-center gap-4 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center border border-[#d8cdbd]">
                    <Clock3 className="size-4 text-[#a65f45]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {task.title}
                    </p>
                    <p className="text-xs text-[#72736d]">{task.category}</p>
                  </div>
                  <time className="text-xs font-semibold text-[#5f655f]">
                    {format(new Date(`${task.due}T12:00:00`), "MMM d")}
                  </time>
                </div>
              ))}
          </div>
        </Card>
        <Card>
          <div className="border-b border-[#d8cdbd] px-6 py-5">
            <h2 className="font-display text-2xl text-[#263d32]">
              Recent activity
            </h2>
          </div>
          <div className="divide-y divide-[#e2dacf] px-6">
            {[
              ["Padua venue marked booked", "Jul 10"],
              ["Budget target updated to $85,000", "Jul 8"],
              ["Photography note pinned", "Jul 8"],
            ].map(([item, date]) => (
              <div key={item} className="flex items-center gap-4 py-4">
                <span className="size-2 bg-[#7d8b72]" />
                <p className="flex-1 text-sm">{item}</p>
                <time className="text-xs text-[#77786f]">{date}</time>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}
