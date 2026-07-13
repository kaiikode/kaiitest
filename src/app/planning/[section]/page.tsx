import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BudgetSection } from "@/components/planning/budget";
import { ChecklistSection } from "@/components/planning/checklist";
import { GuestsSection } from "@/components/planning/guests";
import { InspirationSection } from "@/components/planning/inspiration";
import { OverviewSection } from "@/components/planning/overview";
import { TimelineSection } from "@/components/planning/timeline";
import {
  DocumentsSection,
  FinalDetailsSection,
  NotesSection,
  SettingsSection,
  TeamSection,
} from "@/components/planning/utility-sections";
import { VendorsSection } from "@/components/planning/vendors";
import { VenueSection } from "@/components/planning/venue";

const sections = {
  overview: OverviewSection,
  checklist: ChecklistSection,
  timeline: TimelineSection,
  budget: BudgetSection,
  guests: GuestsSection,
  vendors: VendorsSection,
  inspiration: InspirationSection,
  venue: VenueSection,
  notes: NotesSection,
  documents: DocumentsSection,
  team: TeamSection,
  "final-details": FinalDetailsSection,
  settings: SettingsSection,
};

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function PlanningSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const Component = sections[section as keyof typeof sections];
  if (!Component) notFound();

  return (
    <Suspense
      fallback={
        <div
          className="h-72 animate-pulse bg-[#e8e1d5]"
          aria-label="Loading planning workspace"
        />
      }
    >
      <Component />
    </Suspense>
  );
}
