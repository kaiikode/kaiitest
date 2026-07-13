"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Mail, Plus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { initialVendors, type Vendor } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { currency } from "@/lib/utils";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SectionHeading } from "./section-heading";

export function VendorsSection() {
  const [vendors, setVendors] = usePersistentState("vendors", initialVendors);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    business: "",
    contact: "",
    category: "Photographer",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    contract: "Inquired",
    deposit: "",
    cost: "",
    notes: "",
  });
  const filtered = useMemo(
    () =>
      vendors.filter(
        (vendor) =>
          (category === "All categories" || vendor.category === category) &&
          `${vendor.business} ${vendor.contact}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [vendors, query, category],
  );

  return (
    <>
      <SectionHeading
        eyebrow="YOUR CREATIVE PARTNERS"
        title="Vendors"
        description="Keep contacts, agreements, costs, files, and next steps close to the decisions they support."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> Add vendor
          </Button>
        }
      />

      {showAdd && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.business || !draft.contact)
                return toast.error("Add a business and contact name.");
              const vendor: Vendor = {
                id: crypto.randomUUID(),
                business: draft.business,
                contact: draft.contact,
                category: draft.category,
                email: draft.email,
                contract: draft.contract,
                cost: Number(draft.cost || 0),
              };
              setVendors((current) => [...current, vendor]);
              setShowAdd(false);
              setDraft({
                business: "",
                contact: "",
                category: "Photographer",
                email: "",
                phone: "",
                website: "",
                instagram: "",
                contract: "Inquired",
                deposit: "",
                cost: "",
                notes: "",
              });
              track("vendor_added", { category: vendor.category });
              toast.success("Vendor added.");
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="grid gap-2 text-xs font-semibold">
              Business name
              <Input
                value={draft.business}
                onChange={(event) =>
                  setDraft({ ...draft, business: event.target.value })
                }
                autoFocus
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Contact name
              <Input
                value={draft.contact}
                onChange={(event) =>
                  setDraft({ ...draft, contact: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Category
              <Select
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              >
                {[
                  "Venue",
                  "Photographer",
                  "Videographer",
                  "DJ",
                  "Band",
                  "Florist",
                  "Planner",
                  "Officiant",
                  "Cake",
                  "Rentals",
                  "Transportation",
                  "Hair and Makeup",
                  "Invitations",
                  "Entertainment",
                  "Other",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
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
              Phone
              <Input
                type="tel"
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Website
              <Input
                type="url"
                value={draft.website}
                onChange={(event) =>
                  setDraft({ ...draft, website: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Instagram
              <Input
                value={draft.instagram}
                onChange={(event) =>
                  setDraft({ ...draft, instagram: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Contract status
              <Select
                value={draft.contract}
                onChange={(event) =>
                  setDraft({ ...draft, contract: event.target.value })
                }
              >
                <option>Inquired</option>
                <option>Reviewing</option>
                <option>Booked</option>
                <option>Declined</option>
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Deposit
              <Input
                type="number"
                value={draft.deposit}
                onChange={(event) =>
                  setDraft({ ...draft, deposit: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Total cost
              <Input
                type="number"
                value={draft.cost}
                onChange={(event) =>
                  setDraft({ ...draft, cost: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Notes
              <Textarea
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
              />
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <Button type="submit">Save vendor</Button>
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

      <Card className="mb-6 border-l-4 border-l-[#b4935a] p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              PADUA PREFERRED VENDORS
            </p>
            <h2 className="font-display mt-2 text-3xl text-[#263d32]">
              Experienced with the estate
            </h2>
            <p className="mt-2 text-sm text-[#696b65]">
              A starting point for your research, never a requirement.
            </p>
          </div>
          <Badge tone="gold">
            <Star className="mr-1 size-3" /> 3 in your list
          </Badge>
        </div>
      </Card>

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_220px]">
        <label className="relative">
          <span className="sr-only">Search vendors</span>
          <Search className="absolute left-3 top-3.5 size-4 text-[#777970]" />
          <Input
            className="pl-9"
            placeholder="Search vendors or contacts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option>All categories</option>
          {[...new Set(vendors.map((vendor) => vendor.category))].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </Select>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <Card
            key={vendor.id}
            className={`relative p-5 ${vendor.preferred ? "border-t-4 border-t-[#b4935a]" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#777970]">
                  {vendor.category}
                </p>
                <h2 className="font-display mt-2 text-2xl text-[#263d32]">
                  {vendor.business}
                </h2>
              </div>
              {vendor.preferred && (
                <span
                  title="Padua preferred vendor"
                  className="flex size-8 items-center justify-center bg-[#f1e9d9] text-[#806839]"
                >
                  <Star className="size-4" />
                </span>
              )}
            </div>
            <p className="mt-4 text-sm font-semibold">{vendor.contact}</p>
            <a
              href={`mailto:${vendor.email}`}
              className="mt-1 flex items-center gap-2 text-xs text-[#68716a] hover:underline"
            >
              <Mail className="size-3" /> {vendor.email}
            </a>
            <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#e1d8ca] py-4 text-xs">
              <div>
                <p className="text-[#777970]">Contract</p>
                <p className="mt-1 font-semibold">{vendor.contract}</p>
              </div>
              <div>
                <p className="text-[#777970]">Total cost</p>
                <p className="mt-1 font-semibold">{currency(vendor.cost)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge tone={vendor.contract === "Booked" ? "sage" : "gold"}>
                {vendor.contract}
              </Badge>
              <Button
                variant="quiet"
                size="sm"
                onClick={() =>
                  toast.info(
                    `${vendor.business}: payment schedule, files, tasks, notes and rating are ready to edit.`,
                  )
                }
              >
                Open record <ExternalLink className="size-3" />
              </Button>
            </div>
          </Card>
        ))}
      </section>
      {!filtered.length && (
        <Card className="p-12 text-center">
          <p className="font-display text-2xl text-[#263d32]">
            No vendors match this view.
          </p>
          <Button
            variant="quiet"
            className="mt-3"
            onClick={() => {
              setQuery("");
              setCategory("All categories");
            }}
          >
            Clear filters
          </Button>
        </Card>
      )}
    </>
  );
}
