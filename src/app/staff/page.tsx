"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  MessageSquareText,
  Search,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";

const initialCouples = [
  {
    id: "w1",
    names: "Olivia & Marcus",
    date: "Oct 17, 2027",
    stage: "Vendors booked",
    booked: true,
    tour: "Completed",
    overdue: 0,
    coordinator: "Claire Bennett",
  },
  {
    id: "w2",
    names: "Isabella & Jordan",
    date: "May 22, 2027",
    stage: "Venue booked",
    booked: true,
    tour: "Completed",
    overdue: 2,
    coordinator: "Claire Bennett",
  },
  {
    id: "w3",
    names: "Maya & Daniel",
    date: "Sep 4, 2027",
    stage: "Comparing venues",
    booked: false,
    tour: "Estimate received",
    overdue: 1,
    coordinator: "Jordan Lee",
  },
  {
    id: "w4",
    names: "Avery & Rowan",
    date: "Date undecided",
    stage: "Just started",
    booked: false,
    tour: "Requested",
    overdue: 0,
    coordinator: "Unassigned",
  },
];

export default function StaffDashboard() {
  const [couples, setCouples] = useState(initialCouples);
  const [query, setQuery] = useState("");
  const [booking, setBooking] = useState("All");
  const [active, setActive] = useState<(typeof initialCouples)[number] | null>(
    null,
  );
  const [note, setNote] = useState("");
  const visible = useMemo(
    () =>
      couples.filter(
        (couple) =>
          (booking === "All" ||
            (booking === "Booked" ? couple.booked : !couple.booked)) &&
          couple.names.toLowerCase().includes(query.toLowerCase()),
      ),
    [couples, query, booking],
  );
  return (
    <>
      <header className="mb-8">
        <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
          MONDAY, JULY 13
        </p>
        <h1 className="font-display mt-2 text-5xl text-[#263d32]">
          Couple care dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666861]">
          A focused view of assigned weddings, tour follow-up, support requests,
          and planning issues that need attention.
        </p>
      </header>
      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          [UsersRound, "Assigned couples", couples.length],
          [
            CalendarDays,
            "Booked weddings",
            couples.filter((item) => item.booked).length,
          ],
          [
            AlertTriangle,
            "Overdue tasks",
            couples.reduce((sum, item) => sum + item.overdue, 0),
          ],
          [MessageSquareText, "Open requests", 3],
        ].map(([Icon, label, value]) => {
          const StatIcon = Icon as typeof UsersRound;
          return (
            <Card key={String(label)} className="p-5">
              <StatIcon className="size-4 text-[#a65f45]" />
              <p className="font-display mt-3 text-4xl text-[#263d32]">
                {Number(value)}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.09em] text-[#6e716a]">
                {String(label)}
              </p>
            </Card>
          );
        })}
      </section>
      <Card>
        <div className="grid gap-3 border-b border-[#d8cdbd] p-4 sm:grid-cols-[1fr_200px_200px]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 size-4 text-[#777970]" />
            <span className="sr-only">Search couples</span>
            <Input
              className="pl-9"
              placeholder="Search couples"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <Select
            value={booking}
            onChange={(event) => setBooking(event.target.value)}
          >
            <option>All</option>
            <option>Booked</option>
            <option>Not booked</option>
          </Select>
          <Select defaultValue="All dates">
            <option>All dates</option>
            <option>Next 90 days</option>
            <option>2027</option>
            <option>Date undecided</option>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-[#eee7da] text-[11px] uppercase tracking-[0.09em] text-[#62655f]">
              <tr>
                {[
                  "Couple",
                  "Wedding date",
                  "Planning stage",
                  "Tour",
                  "Coordinator",
                  "Attention",
                  "",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1d8ca]">
              {visible.map((couple) => (
                <tr key={couple.id} className="bg-white text-sm">
                  <td className="px-5 py-4 font-semibold">
                    {couple.names}
                    <p className="mt-1 text-xs font-normal text-[#777970]">
                      {couple.booked ? "Booked" : "Prospective"}
                    </p>
                  </td>
                  <td className="px-5 py-4">{couple.date}</td>
                  <td className="px-5 py-4">{couple.stage}</td>
                  <td className="px-5 py-4">
                    <Badge tone={couple.tour === "Completed" ? "sage" : "gold"}>
                      {couple.tour}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{couple.coordinator}</td>
                  <td className="px-5 py-4">
                    {couple.overdue ? (
                      <span className="font-semibold text-[#9b4d38]">
                        {couple.overdue} overdue
                      </span>
                    ) : (
                      <span className="text-[#57705d]">On track</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      variant="quiet"
                      size="sm"
                      onClick={() => setActive(couple)}
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {active && (
        <Card className="mt-6 border-t-4 border-t-[#b4935a] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <p className="font-architectural text-[10px] tracking-[0.18em] text-[#806839]">
                COUPLE RECORD
              </p>
              <h2 className="font-display mt-2 text-4xl text-[#263d32]">
                {active.names}
              </h2>
              <p className="mt-2 text-sm text-[#666861]">
                {active.date} · {active.stage}
              </p>
            </div>
            <Button asChild>
              <Link href="/planning/overview">Open couple workspace</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-5 border-t border-[#e1d8ca] pt-6 lg:grid-cols-3">
            <label className="grid gap-2 text-xs font-semibold">
              Coordinator
              <Select
                value={active.coordinator}
                onChange={(event) => {
                  const coordinator = event.target.value;
                  setCouples((current) =>
                    current.map((item) =>
                      item.id === active.id ? { ...item, coordinator } : item,
                    ),
                  );
                  setActive({ ...active, coordinator });
                  toast.success("Coordinator assignment updated.");
                }}
              >
                <option>Unassigned</option>
                <option>Claire Bennett</option>
                <option>Jordan Lee</option>
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Booking status
              <Select
                value={active.booked ? "Booked" : "Prospective"}
                onChange={(event) => {
                  const booked = event.target.value === "Booked";
                  setCouples((current) =>
                    current.map((item) =>
                      item.id === active.id ? { ...item, booked } : item,
                    ),
                  );
                  setActive({ ...active, booked });
                  toast.success("Booking status updated.");
                }}
              >
                <option>Prospective</option>
                <option>Booked</option>
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Internal note
              <Textarea
                className="min-h-11"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Visible to authorized staff only"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                if (!note.trim())
                  return toast.error("Add an internal note first.");
                setNote("");
                toast.success("Internal note saved.");
              }}
            >
              Save internal note
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
