import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  WalletCards,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://planning.paduaweddings.com";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Padua Wedding Planning",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: appUrl,
    description:
      "A personalized planning space for couples considering or celebrating at Padua Weddings.",
  };

  return (
    <main id="main-content" className="overflow-hidden bg-[#f6f1e7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:px-16">
          <Link
            href="/"
            aria-label="Padua Wedding Planning home"
            className="text-white"
          >
            <span className="font-architectural block text-[11px] tracking-[0.32em] text-[#d9c396]">
              PADUA
            </span>
            <span className="font-display text-xl tracking-wide">
              Wedding Planning
            </span>
          </Link>
          <nav
            className="flex items-center gap-2 sm:gap-5"
            aria-label="Primary"
          >
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-semibold text-white/90 hover:text-white sm:inline"
            >
              Sign in
            </Link>
            <Button
              asChild
              variant="secondary"
              className="border-white/50 text-white hover:bg-white/10"
            >
              <Link href="/tour">Book a Private Tour</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[790px] bg-[#263d32] text-white">
        <div className="tile-motif absolute inset-0 opacity-40" />
        <div className="absolute -right-20 top-20 hidden h-[720px] w-[48%] border border-[#b4935a]/30 lg:block" />
        <div className="arch absolute -bottom-12 right-[4%] hidden h-[650px] w-[42%] overflow-hidden border-[10px] border-[#f6f1e7]/10 bg-[#334f40] lg:block">
          <div className="absolute inset-10 border border-[#b4935a]/40">
            <div className="absolute inset-x-12 bottom-0 h-[64%] border-x border-t border-[#d8cdbd]/25">
              <div className="arch absolute bottom-0 left-1/2 h-[72%] w-[52%] -translate-x-1/2 bg-[#263d32]">
                <div className="absolute bottom-12 left-1/2 size-40 -translate-x-1/2 rounded-full border border-[#b4935a]/50" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[790px] max-w-[1440px] items-center px-5 pb-20 pt-36 sm:px-10 lg:px-16">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9c396]">
              <span className="h-px w-10 bg-[#b4935a]" />A private planning
              concierge
            </div>
            <h1 className="font-display max-w-3xl text-6xl font-medium leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:text-[92px]">
              Plan Your Wedding With Padua
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#e5dfd4] sm:text-xl">
              Everything you need to organize the details, protect the
              experience, and plan a celebration that feels like you.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="border-[#f6f1e7] bg-[#f6f1e7] text-[#263d32] hover:bg-white"
              >
                <Link href="/onboarding">
                  Start Planning <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/45 text-white hover:bg-white/10"
              >
                <Link href="/tour">Book a Private Tour</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#d8cdbd]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#b4935a]" /> Saved
                securely
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#b4935a]" /> Made for
                Padua couples
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-24 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:py-32">
        <div>
          <p className="font-architectural mb-5 text-xs tracking-[0.2em] text-[#806839]">
            ONE CONSIDERED SPACE
          </p>
          <h2 className="font-display text-5xl leading-none text-[#263d32] sm:text-6xl">
            Planning Should Feel Clear
          </h2>
        </div>
        <div className="lg:pt-7">
          <p className="max-w-2xl text-xl leading-9 text-[#4f514c]">
            Your checklist, timeline, budget, guest list, vendors, and venue
            details should work together—not live across ten different apps.
          </p>
          <div className="mt-12 grid gap-px border border-[#cfc2b0] bg-[#cfc2b0] sm:grid-cols-2">
            {[
              [CheckCircle2, "A checklist that changes with your date"],
              [CalendarDays, "A timeline built around real decisions"],
              [WalletCards, "A clear view of commitments and payments"],
              [UsersRound, "Guest details without spreadsheet chaos"],
            ].map(([Icon, label]) => {
              const FeatureIcon = Icon as typeof CheckCircle2;
              return (
                <div
                  key={String(label)}
                  className="flex min-h-36 items-start gap-4 bg-[#f6f1e7] p-7"
                >
                  <FeatureIcon className="mt-0.5 size-5 text-[#a65f45]" />
                  <p className="font-display text-2xl leading-7 text-[#263d32]">
                    {String(label)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[560px] overflow-hidden bg-[#d8cdbd] p-10 sm:p-16">
            <div className="tile-motif absolute inset-0 opacity-60" />
            <div className="arch absolute bottom-0 left-[12%] h-[82%] w-[76%] border-[18px] border-[#263d32] bg-[#f6f1e7]">
              <div className="absolute inset-8 border border-[#b4935a]">
                <MapPin
                  className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-[#a65f45]"
                  strokeWidth={1.2}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center px-6 py-20 sm:px-16 lg:px-20">
            <div>
              <p className="font-architectural mb-5 text-xs tracking-[0.2em] text-[#806839]">
                CREATED FOR THE ESTATE
              </p>
              <h2 className="font-display text-5xl leading-none text-[#263d32] sm:text-6xl">
                Built Around the Padua Experience
              </h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#55564f]">
                From your ceremony vision to the final dance, your planning
                space helps you prepare for the decisions that shape the entire
                guest experience.
              </p>
              <ul className="mt-10 grid gap-4 text-sm text-[#3f453f] sm:grid-cols-2">
                {[
                  "Ceremony & reception vision",
                  "Food and beverage questions",
                  "Photography location notes",
                  "Direct planning support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border-t border-[#d8cdbd] pt-4"
                  >
                    <span className="size-1.5 bg-[#b4935a]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#a65f45] px-5 py-24 text-center text-white sm:px-10 sm:py-28">
        <p className="font-architectural text-xs tracking-[0.22em] text-[#f0d6c9]">
          BEGIN WITH WHAT YOU KNOW
        </p>
        <h2 className="font-display mx-auto mt-5 max-w-3xl text-5xl leading-none sm:text-6xl">
          Your Wedding Has Already Started Taking Shape
        </h2>
        <p className="mt-6 text-lg text-[#f7e8e1]">
          Bring the details together in one place.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-9 border-white bg-white text-[#263d32] hover:bg-[#f6f1e7]"
        >
          <Link href="/onboarding">
            Create Your Planning Space <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <footer className="bg-[#202f28] px-5 py-12 text-[#d8cdbd]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-architectural text-xs tracking-[0.24em] text-[#d9c396]">
              PADUA WEDDINGS
            </p>
            <p className="font-display mt-1 text-xl">Wedding Planning</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
            <Link href="/tour" className="hover:text-white">
              Private tours
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
