"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownUp, Download, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { initialGuests, type Guest } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { SectionHeading } from "./section-heading";

const statusTone = (status: Guest["status"]) =>
  status === "Attending"
    ? "sage"
    : status === "Declined"
      ? "terracotta"
      : status === "Invited"
        ? "gold"
        : "stone";

export function GuestsSection() {
  const [guests, setGuests] = useState(initialGuests);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState({
    firstName: "",
    lastName: "",
    household: "",
    email: "",
    status: "Invited",
    meal: "Not selected",
    table: "—",
  });
  const fileInput = useRef<HTMLInputElement>(null);
  const pageSize = 5;

  const filtered = useMemo(
    () =>
      guests
        .filter((guest) => filter === "All statuses" || guest.status === filter)
        .filter((guest) =>
          `${guest.firstName} ${guest.lastName} ${guest.household}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort(
          (a, b) => (sortAsc ? 1 : -1) * a.lastName.localeCompare(b.lastName),
        ),
    [guests, filter, query, sortAsc],
  );
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const stats = {
    total: guests.length,
    attending: guests.filter((guest) => guest.status === "Attending").length,
    declined: guests.filter((guest) => guest.status === "Declined").length,
    awaiting: guests.filter(
      (guest) => guest.status === "Invited" || guest.status === "No Response",
    ).length,
  };

  const exportCsv = () => {
    const rows = [
      "First Name,Last Name,Household,Email,RSVP,Meal,Table",
      ...guests.map((guest) =>
        [
          guest.firstName,
          guest.lastName,
          guest.household,
          guest.email,
          guest.status,
          guest.meal,
          guest.table,
        ]
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      ),
    ];
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([rows.join("\n")], { type: "text/csv" }),
    );
    link.download = "padua-guest-list.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Guest list exported.");
  };

  const importCsv = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const rows = text.split(/\r?\n/).slice(1).filter(Boolean);
    const imported = rows.map((row) => {
      const values = row
        .split(",")
        .map((value) => value.replace(/^"|"$/g, "").trim());
      return {
        id: crypto.randomUUID(),
        firstName: values[0] || "Guest",
        lastName: values[1] || "",
        household: values[2] || "Imported",
        email: values[3] || "",
        status: (values[4] || "Invited") as Guest["status"],
        meal: values[5] || "Not selected",
        table: values[6] || "—",
      };
    });
    setGuests((current) => [...current, ...imported]);
    toast.success(`${imported.length} guests imported.`);
  };

  return (
    <>
      <SectionHeading
        eyebrow="THE PEOPLE AT THE CENTER"
        title="Guest List"
        description="Organize households, responses, meal needs, and table notes while keeping the human details visible."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> Add guest
          </Button>
        }
      />

      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total invited", stats.total],
          ["Attending", stats.attending],
          ["Declined", stats.declined],
          ["Awaiting response", stats.awaiting],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#70726c]">
              {String(label)}
            </p>
            <p className="font-display mt-2 text-4xl text-[#263d32]">
              {Number(value)}
            </p>
          </Card>
        ))}
      </section>

      {showAdd && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.firstName || !draft.lastName)
                return toast.error("Add a first and last name.");
              const guest = {
                ...draft,
                id: crypto.randomUUID(),
                status: draft.status as Guest["status"],
              };
              setGuests((current) => [...current, guest]);
              setDraft({
                firstName: "",
                lastName: "",
                household: "",
                email: "",
                status: "Invited",
                meal: "Not selected",
                table: "—",
              });
              setShowAdd(false);
              track("guest_added", { status: guest.status });
              toast.success("Guest added.");
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="grid gap-2 text-xs font-semibold">
              First name
              <Input
                value={draft.firstName}
                onChange={(event) =>
                  setDraft({ ...draft, firstName: event.target.value })
                }
                autoFocus
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Last name
              <Input
                value={draft.lastName}
                onChange={(event) =>
                  setDraft({ ...draft, lastName: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Household
              <Input
                value={draft.household}
                onChange={(event) =>
                  setDraft({ ...draft, household: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Email
              <Input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              RSVP status
              <Select
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value })
                }
              >
                {[
                  "Not Invited",
                  "Invited",
                  "Attending",
                  "Declined",
                  "No Response",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Meal preference
              <Input
                value={draft.meal}
                onChange={(event) =>
                  setDraft({ ...draft, meal: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Table assignment
              <Input
                value={draft.table}
                onChange={(event) =>
                  setDraft({ ...draft, table: event.target.value })
                }
              />
            </label>
            <div className="flex items-end gap-2">
              <Button type="submit">Save guest</Button>
              <Button
                type="button"
                variant="quiet"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="grid gap-3 border-b border-[#d8cdbd] p-4 lg:grid-cols-[1fr_190px_auto_auto]">
          <label className="relative">
            <span className="sr-only">Search guests</span>
            <Search className="absolute left-3 top-3.5 size-4 text-[#777970]" />
            <Input
              className="pl-9"
              placeholder="Search names or households"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <Select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All statuses</option>
            {[
              "Not Invited",
              "Invited",
              "Attending",
              "Declined",
              "No Response",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => importCsv(event.target.files?.[0])}
          />
          <Button
            variant="secondary"
            onClick={() => fileInput.current?.click()}
          >
            <Upload className="size-4" /> Import CSV
          </Button>
          <Button variant="secondary" onClick={exportCsv}>
            <Download className="size-4" /> Export
          </Button>
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-[#d8cdbd] bg-[#eee7da] px-5 py-3 text-xs">
            <span className="font-semibold">{selected.length} selected</span>
            <Select
              className="max-w-44 min-h-9"
              defaultValue=""
              onChange={(event) => {
                const next = event.target.value as Guest["status"];
                setGuests((current) =>
                  current.map((guest) =>
                    selected.includes(guest.id)
                      ? { ...guest, status: next }
                      : guest,
                  ),
                );
                setSelected([]);
                toast.success("Guest statuses updated.");
              }}
            >
              <option value="" disabled>
                Bulk update status
              </option>
              {["Invited", "Attending", "Declined", "No Response"].map(
                (value) => (
                  <option key={value}>{value}</option>
                ),
              )}
            </Select>
          </div>
        )}

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#f3eee5] text-[11px] uppercase tracking-[0.09em] text-[#656861]">
              <tr>
                <th className="px-5 py-3">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-5 py-3">
                  <button
                    onClick={() => setSortAsc((value) => !value)}
                    className="flex items-center gap-2 font-semibold"
                  >
                    Guest <ArrowDownUp className="size-3" />
                  </button>
                </th>
                <th className="px-5 py-3">Household</th>
                <th className="px-5 py-3">RSVP</th>
                <th className="px-5 py-3">Meal</th>
                <th className="px-5 py-3">Table</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1d8ca]">
              {pageItems.map((guest) => (
                <tr key={guest.id} className="bg-white text-sm">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(guest.id)}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, guest.id]
                            : current.filter((id) => id !== guest.id),
                        )
                      }
                      aria-label={`Select ${guest.firstName} ${guest.lastName}`}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="text-xs text-[#76776f]">{guest.email}</p>
                  </td>
                  <td className="px-5 py-4">{guest.household}</td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(guest.status)}>
                      {guest.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">{guest.meal}</td>
                  <td className="px-5 py-4">{guest.table}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y divide-[#e1d8ca] sm:hidden">
          {pageItems.map((guest) => (
            <div key={guest.id} className="bg-white p-5">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {guest.firstName} {guest.lastName}
                  </p>
                  <p className="text-xs text-[#74766f]">{guest.household}</p>
                </div>
                <Badge tone={statusTone(guest.status)}>{guest.status}</Badge>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-[#77786f]">Meal</dt>
                  <dd className="mt-1 font-semibold">{guest.meal}</dd>
                </div>
                <div>
                  <dt className="text-[#77786f]">Table</dt>
                  <dd className="mt-1 font-semibold">{guest.table}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[#d8cdbd] px-5 py-4 text-xs">
          <span>{filtered.length} results</span>
          <div className="flex gap-2">
            <Button
              variant="quiet"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <Button
              variant="quiet"
              size="sm"
              disabled={page * pageSize >= filtered.length}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
      <p className="mt-4 text-xs text-[#70736d]">
        Adults: 4 · Children: 1. Add age details to guest records for accurate
        counts.
      </p>
    </>
  );
}
