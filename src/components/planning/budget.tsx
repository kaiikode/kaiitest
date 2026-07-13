"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AlertCircle, Plus, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { couple, initialBudget, type BudgetItem } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { currency } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export function BudgetSection() {
  const [items, setItems] = useState(initialBudget);
  const [showAdd, setShowAdd] = useState(false);
  const [target, setTarget] = useState(couple.targetBudget);
  const [draft, setDraft] = useState({
    name: "",
    category: "Venue",
    estimated: "",
    actual: "",
    paid: "",
    due: "2027-09-01",
  });
  const totals = useMemo(
    () => ({
      estimated: items.reduce((sum, item) => sum + item.estimated, 0),
      spent: items.reduce((sum, item) => sum + item.actual, 0),
      paid: items.reduce((sum, item) => sum + item.paid, 0),
    }),
    [items],
  );
  const remaining = target - totals.spent;
  const chartData = [
    { name: "Committed", value: totals.spent, color: "#7d8b72" },
    { name: "Unallocated", value: Math.max(0, remaining), color: "#e4ddd1" },
  ];

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name || !draft.estimated)
      return toast.error("Add a name and estimated amount.");
    const item: BudgetItem = {
      id: crypto.randomUUID(),
      name: draft.name,
      category: draft.category,
      estimated: Number(draft.estimated),
      actual: Number(draft.actual || 0),
      paid: Number(draft.paid || 0),
      due: draft.due,
    };
    setItems((current) => [...current, item]);
    setDraft({
      name: "",
      category: "Venue",
      estimated: "",
      actual: "",
      paid: "",
      due: "2027-09-01",
    });
    setShowAdd(false);
    track("budget_item_added", {
      category: item.category,
      estimated: item.estimated,
    });
    toast.success("Budget item added.");
  };

  return (
    <>
      <SectionHeading
        eyebrow="KNOW WHAT IS COMMITTED"
        title="Budget"
        description="Track estimates, final costs, payments, and upcoming balances in one calm view."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> Add expense
          </Button>
        }
      />

      {showAdd && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={add}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Expense name
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                autoFocus
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
                  "Catering",
                  "Bar",
                  "Photography",
                  "Videography",
                  "Entertainment",
                  "Florals",
                  "Rentals",
                  "Attire",
                  "Beauty",
                  "Invitations",
                  "Transportation",
                  "Cake and Desserts",
                  "Décor",
                  "Favors",
                  "Miscellaneous",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Due date
              <Input
                type="date"
                value={draft.due}
                onChange={(event) =>
                  setDraft({ ...draft, due: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Estimated amount
              <Input
                type="number"
                value={draft.estimated}
                onChange={(event) =>
                  setDraft({ ...draft, estimated: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Actual amount
              <Input
                type="number"
                value={draft.actual}
                onChange={(event) =>
                  setDraft({ ...draft, actual: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Paid amount
              <Input
                type="number"
                value={draft.paid}
                onChange={(event) =>
                  setDraft({ ...draft, paid: event.target.value })
                }
              />
            </label>
            <div className="flex items-end gap-3">
              <Button type="submit">Save expense</Button>
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

      <section className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#6e716a]">
                Target budget
              </p>
              <p className="font-display mt-2 text-4xl text-[#263d32]">
                {currency(target)}
              </p>
            </div>
            <WalletCards className="size-5 text-[#a65f45]" />
          </div>
          <label className="mt-5 grid gap-2 text-xs font-semibold">
            Adjust target
            <Input
              type="number"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
            />
          </label>
          <div
            className="relative mx-auto mt-2 h-52 max-w-72"
            aria-hidden="true"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={82}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl text-[#263d32]">
                {Math.round((totals.spent / target) * 100)}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#6f716b]">
                used
              </span>
            </div>
          </div>
          <p className="sr-only">
            You have committed {currency(totals.spent)}, or{" "}
            {Math.round((totals.spent / target) * 100)} percent of your{" "}
            {currency(target)} target. {currency(remaining)} remains.
          </p>
        </Card>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["Total estimated", totals.estimated, "Current working plan"],
            ["Total committed", totals.spent, "Signed or final costs"],
            ["Total paid", totals.paid, "Payments completed"],
            ["Remaining", remaining, "Within target budget"],
          ].map(([label, value, note]) => (
            <Card key={String(label)} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#6e716a]">
                {String(label)}
              </p>
              <p className="font-display mt-3 text-4xl text-[#263d32]">
                {currency(Number(value))}
              </p>
              <p className="mt-2 text-xs text-[#75766f]">{String(note)}</p>
            </Card>
          ))}
        </div>
      </section>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#d8cdbd] px-5 py-4">
          <h2 className="font-display text-2xl text-[#263d32]">Expense plan</h2>
          <span className="text-xs text-[#73756e]">{items.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead className="bg-[#eee7da] text-[11px] uppercase tracking-[0.1em] text-[#61645e]">
              <tr>
                {[
                  "Expense",
                  "Category",
                  "Estimated",
                  "Actual",
                  "Paid",
                  "Balance",
                  "Status",
                ].map((heading) => (
                  <th key={heading} className="px-5 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1d8ca]">
              {items.map((item) => {
                const balance = Math.max(0, item.actual - item.paid);
                return (
                  <tr key={item.id} className="bg-white text-sm">
                    <td className="px-5 py-4 font-semibold">{item.name}</td>
                    <td className="px-5 py-4 text-[#666a65]">
                      {item.category}
                    </td>
                    <td className="px-5 py-4">{currency(item.estimated)}</td>
                    <td className="px-5 py-4">
                      {item.actual ? currency(item.actual) : "—"}
                    </td>
                    <td className="px-5 py-4">{currency(item.paid)}</td>
                    <td className="px-5 py-4 font-semibold">
                      {currency(balance)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={balance ? "gold" : "sage"}>
                        {balance ? "Scheduled" : "Paid"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6 border-l-4 border-l-[#b4935a] p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              PADUA EXPENSES
            </p>
            <h2 className="font-display mt-2 text-3xl text-[#263d32]">
              Venue plan
            </h2>
            <p className="mt-2 text-sm text-[#666861]">
              Placeholder schedule until your Padua estimate is connected.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-[#74766f]">Deposit</p>
              <p className="mt-1 font-semibold">{currency(7000)}</p>
            </div>
            <div>
              <p className="text-xs text-[#74766f]">Remaining</p>
              <p className="mt-1 font-semibold">{currency(21000)}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-3 bg-[#f4efe5] p-4 text-xs leading-5 text-[#61635d]">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#a65f45]" /> Your
          Padua coordinator will confirm availability, pricing, scheduled
          payments, enhancements, and final selections.
        </div>
      </Card>
    </>
  );
}
