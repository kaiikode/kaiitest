import { PlannerShell } from "@/components/planner-shell";

export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlannerShell>{children}</PlannerShell>;
}
