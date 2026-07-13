"use client";

import { useState } from "react";
import {
  Activity,
  ClipboardList,
  Plus,
  Store,
  UserCog,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";

const tabs = [
  "Users & access",
  "Templates",
  "Venue content",
  "Preferred vendors",
  "Activity",
];

export default function AdminDashboard() {
  const [active, setActive] = useState(tabs[0]);
  const [users, setUsers] = useState([
    {
      name: "Olivia Rivera",
      email: "olivia@example.com",
      role: "Couple",
      assignment: "Olivia & Marcus",
    },
    {
      name: "Claire Bennett",
      email: "claire@paduaweddings.com",
      role: "Padua Staff",
      assignment: "12 couples",
    },
    {
      name: "Jordan Lee",
      email: "jordan@paduaweddings.com",
      role: "Padua Staff",
      assignment: "8 couples",
    },
  ]);
  const [templates, setTemplates] = useState([
    "Book venue",
    "Confirm photographer",
    "Finalize guest list",
    "Schedule menu planning",
    "Submit final guest count",
  ]);
  const [draft, setDraft] = useState("");
  return (
    <>
      <header className="mb-8">
        <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
          SYSTEM STEWARDSHIP
        </p>
        <h1 className="font-display mt-2 text-5xl text-[#263d32]">
          Platform administration
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#666861]">
          Manage access, planning foundations, Padua content, preferred-vendor
          records, and platform activity.
        </p>
      </header>
      <section className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          [UsersRound, "Active couples", 48],
          [UserCog, "Staff accounts", 7],
          [ClipboardList, "Tasks completed", 1247],
          [Activity, "30-day active", "76%"],
        ].map(([Icon, label, value]) => {
          const StatIcon = Icon as typeof UsersRound;
          return (
            <Card key={String(label)} className="p-5">
              <StatIcon className="size-4 text-[#a65f45]" />
              <p className="font-display mt-3 text-4xl text-[#263d32]">
                {String(value)}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.09em] text-[#6e716a]">
                {String(label)}
              </p>
            </Card>
          );
        })}
      </section>
      <div
        className="mb-6 flex overflow-x-auto border-b border-[#bdb2a3]"
        role="tablist"
        aria-label="Administration sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`min-h-12 shrink-0 border-b-2 px-5 text-sm font-semibold ${active === tab ? "border-[#a65f45] text-[#263d32]" : "border-transparent text-[#6a6d66]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Users & access" && (
        <Card>
          <div className="flex items-center justify-between border-b border-[#d8cdbd] p-5">
            <div>
              <h2 className="font-display text-3xl text-[#263d32]">
                Users, staff & assignments
              </h2>
              <p className="mt-1 text-xs text-[#73756f]">
                Role changes are recorded in the activity log.
              </p>
            </div>
            <Button
              onClick={() => {
                setUsers((current) => [
                  ...current,
                  {
                    name: "New Staff Member",
                    email: "new@paduaweddings.com",
                    role: "Padua Staff",
                    assignment: "Unassigned",
                  },
                ]);
                toast.success("Staff invitation created in demo mode.");
              }}
            >
              <Plus className="size-4" /> Invite staff
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-[#eee7da] text-[11px] uppercase tracking-wider text-[#62655f]">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Assignment</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1d8ca]">
                {users.map((user) => (
                  <tr key={user.email} className="bg-white text-sm">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-[#777970]">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Select
                        value={user.role}
                        onChange={(event) => {
                          setUsers((current) =>
                            current.map((item) =>
                              item.email === user.email
                                ? { ...item, role: event.target.value }
                                : item,
                            ),
                          );
                          toast.success("Role updated.");
                        }}
                        className="max-w-44 min-h-9"
                      >
                        <option>Couple</option>
                        <option>Padua Staff</option>
                        <option>Administrator</option>
                      </Select>
                    </td>
                    <td className="px-5 py-4">{user.assignment}</td>
                    <td className="px-5 py-4">
                      <Badge tone="sage">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {active === "Templates" && (
        <Card className="p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-[#263d32]">
                Checklist templates
              </h2>
              <p className="mt-2 text-sm text-[#666861]">
                Defaults are personalized by date, booking status, stage, guest
                count, and preferences.
              </p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!draft) return;
                setTemplates((current) => [...current, draft]);
                setDraft("");
                toast.success("Template task added.");
              }}
              className="flex gap-2"
            >
              <Input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="New template task"
              />
              <Button type="submit">
                <Plus className="size-4" /> Add
              </Button>
            </form>
          </div>
          <div className="mt-6 divide-y divide-[#e1d8ca] border border-[#d8cdbd]">
            {templates.map((template, index) => (
              <div
                key={`${template}-${index}`}
                className="flex min-h-14 items-center gap-3 bg-white px-4"
              >
                <span className="flex size-7 items-center justify-center bg-[#eee7da] text-xs font-bold">
                  {index + 1}
                </span>
                <Input
                  className="min-h-9 border-transparent bg-transparent font-semibold"
                  value={template}
                  onChange={(event) =>
                    setTemplates((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    )
                  }
                />
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => {
                    setTemplates((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    );
                    toast.success("Template task removed.");
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="mt-5"
            onClick={() => toast.success("Checklist template published.")}
          >
            Publish template changes
          </Button>
        </Card>
      )}

      {active === "Venue content" && (
        <Card className="p-6">
          <h2 className="font-display text-3xl text-[#263d32]">
            Venue planning questions & resources
          </h2>
          <p className="mt-2 text-sm text-[#666861]">
            Edit prompts without changing historical couple responses.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-semibold">
              Section
              <Select>
                <option>Ceremony Vision</option>
                <option>Reception Vision</option>
                <option>Guest Experience</option>
                <option>Food & Beverage</option>
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Resource title
              <Input defaultValue="Planning for guest arrival" />
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Question or resource content
              <Textarea defaultValue="What should guests understand before they arrive at the estate?" />
            </label>
            <div className="sm:col-span-2">
              <Button
                onClick={() => toast.success("Venue planning content saved.")}
              >
                Save venue content
              </Button>
            </div>
          </div>
        </Card>
      )}

      {active === "Preferred vendors" && (
        <Card className="p-6">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-[#263d32]">
                Padua preferred vendors
              </h2>
              <p className="mt-2 text-sm text-[#666861]">
                Maintain an optional research starting point for couples.
              </p>
            </div>
            <Store className="size-6 text-[#a65f45]" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Mariposa Photo Co.",
              "Olive & Vine Floral",
              "Hearthside Planning",
            ].map((vendor) => (
              <div
                key={vendor}
                className="border border-[#d8cdbd] bg-white p-5"
              >
                <Badge tone="gold">Preferred</Badge>
                <p className="font-display mt-4 text-2xl text-[#263d32]">
                  {vendor}
                </p>
                <Button
                  variant="quiet"
                  size="sm"
                  className="mt-4 px-0"
                  onClick={() =>
                    toast.info(`${vendor} record opened for editing.`)
                  }
                >
                  Edit record
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="mt-5"
            onClick={() =>
              toast.success("New preferred-vendor form opened in demo mode.")
            }
          >
            <Plus className="size-4" /> Add preferred vendor
          </Button>
        </Card>
      )}

      {active === "Activity" && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="border-b border-[#d8cdbd] p-5">
              <h2 className="font-display text-3xl text-[#263d32]">
                Platform activity
              </h2>
            </div>
            <div className="divide-y divide-[#e1d8ca]">
              {[
                [
                  "Checklist task completed",
                  "Olivia & Marcus",
                  "12 minutes ago",
                ],
                [
                  "Coordinator assignment changed",
                  "Administrator",
                  "1 hour ago",
                ],
                ["Tour requested", "Avery & Rowan", "3 hours ago"],
                ["Budget item added", "Maya & Daniel", "Yesterday"],
              ].map(([event, actor, time]) => (
                <div key={`${event}-${actor}`} className="p-5">
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-semibold">{event}</p>
                    <time className="text-xs text-[#777970]">{time}</time>
                  </div>
                  <p className="mt-1 text-xs text-[#6e716a]">{actor}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-3xl text-[#263d32]">
              Usage summary
            </h2>
            <div className="mt-6 grid gap-5">
              {[
                ["Weekly active couples", "32 of 48", 67],
                ["Onboarding completion", "91%", 91],
                ["Checklist engagement", "84%", 84],
                ["Tour conversion tracking", "Enabled", 100],
              ].map(([label, value, percent]) => (
                <div key={String(label)}>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{String(label)}</span>
                    <span>{String(value)}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[#e4ddd1]">
                    <div
                      className="h-full bg-[#7d8b72]"
                      style={{ width: `${Number(percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </>
  );
}
