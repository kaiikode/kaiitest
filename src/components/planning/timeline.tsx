"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock3, GripVertical, List, Plus, Route } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { dayTimeline, planningTimeline } from "@/lib/demo-data";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SectionHeading } from "./section-heading";

type DayItem = (typeof dayTimeline)[number] & {
  id: string;
  vendor?: string;
  notes?: string;
};

function SortableTimelineItem({ item }: { item: DayItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`grid gap-4 border-b border-[#e1d8ca] bg-white p-5 last:border-0 sm:grid-cols-[30px_110px_1fr_auto] sm:items-center ${isDragging ? "opacity-60 shadow-lg" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="hidden cursor-grab text-[#99998f] sm:block"
        aria-label={`Move ${item.title}`}
      >
        <GripVertical className="size-5" />
      </button>
      <div>
        <p className="text-sm font-bold text-[#263d32]">{item.time}</p>
        <p className="text-xs text-[#77786f]">to {item.end}</p>
      </div>
      <div>
        <p className="font-display text-xl text-[#303630]">{item.title}</p>
        <p className="mt-1 text-xs text-[#6f716b]">
          {item.location} · {item.people}
        </p>
      </div>
      <Clock3 className="hidden size-4 text-[#a65f45] sm:block" />
    </div>
  );
}

export function TimelineSection() {
  const [mode, setMode] = useState<"planning" | "day">("planning");
  const [view, setView] = useState<"visual" | "list">("visual");
  const [items, setItems] = usePersistentState<DayItem[]>(
    "wedding-day-timeline",
    dayTimeline.map((item, index) => ({ ...item, id: `day-${index}` })),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    time: "3:30 PM",
    end: "4:00 PM",
    title: "",
    location: "Courtyard",
    people: "",
    vendor: "",
    notes: "",
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setItems((current) =>
      arrayMove(
        current,
        current.findIndex((item) => item.id === active.id),
        current.findIndex((item) => item.id === over.id),
      ),
    );
    toast.success("Wedding-day order saved.");
  };

  return (
    <>
      <SectionHeading
        eyebrow="FROM TODAY TO THE LAST DANCE"
        title="Timeline"
        description="Keep long-range milestones and the wedding-day schedule connected, without mixing their level of detail."
        action={
          mode === "day" ? (
            <Button onClick={() => setShowAdd((value) => !value)}>
              <Plus className="size-4" /> Add timeline item
            </Button>
          ) : undefined
        }
      />
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row">
        <div className="inline-flex border border-[#bdb2a3] bg-white p-1">
          <button
            onClick={() => setMode("planning")}
            className={`min-h-10 px-4 text-sm font-semibold ${mode === "planning" ? "bg-[#263d32] text-white" : "text-[#555d56]"}`}
          >
            Planning timeline
          </button>
          <button
            onClick={() => setMode("day")}
            className={`min-h-10 px-4 text-sm font-semibold ${mode === "day" ? "bg-[#263d32] text-white" : "text-[#555d56]"}`}
          >
            Wedding day
          </button>
        </div>
        <div className="inline-flex self-start border border-[#bdb2a3] bg-white p-1">
          <button
            onClick={() => setView("visual")}
            aria-label="Visual timeline view"
            className={`flex min-h-9 items-center gap-2 px-3 text-xs font-semibold ${view === "visual" ? "bg-[#eee7da] text-[#263d32]" : "text-[#686b65]"}`}
          >
            <Route className="size-4" /> Visual
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List timeline view"
            className={`flex min-h-9 items-center gap-2 px-3 text-xs font-semibold ${view === "list" ? "bg-[#eee7da] text-[#263d32]" : "text-[#686b65]"}`}
          >
            <List className="size-4" /> List
          </button>
        </div>
      </div>

      {showAdd && mode === "day" && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.title) return toast.error("Add a title.");
              setItems((current) => [
                ...current,
                { ...draft, id: crypto.randomUUID() },
              ]);
              setShowAdd(false);
              setDraft({
                ...draft,
                title: "",
                people: "",
                vendor: "",
                notes: "",
              });
              toast.success("Timeline item added.");
            }}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="grid gap-2 text-xs font-semibold">
              Title
              <Input
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                autoFocus
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Location
              <Select
                value={draft.location}
                onChange={(event) =>
                  setDraft({ ...draft, location: event.target.value })
                }
              >
                {[
                  "Getting Ready Suite",
                  "Courtyard",
                  "Fountain terrace",
                  "Theatre",
                  "Spanish Revival arches",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Start time
              <Input
                value={draft.time}
                onChange={(event) =>
                  setDraft({ ...draft, time: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              End time
              <Input
                value={draft.end}
                onChange={(event) =>
                  setDraft({ ...draft, end: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Assigned people
              <Input
                value={draft.people}
                onChange={(event) =>
                  setDraft({ ...draft, people: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Vendor
              <Input
                value={draft.vendor}
                onChange={(event) =>
                  setDraft({ ...draft, vendor: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold md:col-span-2">
              Notes
              <Textarea
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
              />
            </label>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit">Save item</Button>
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

      {mode === "planning" ? (
        <Card className={view === "visual" ? "px-5 py-8 sm:px-10" : ""}>
          {planningTimeline.map((item, index) => (
            <div
              key={item.title}
              className={`relative ${view === "visual" ? "grid grid-cols-[84px_25px_1fr] gap-4 pb-9 last:pb-0" : "flex gap-5 border-b border-[#e1d8ca] p-5 last:border-0"}`}
            >
              <p className="pt-0.5 text-xs font-bold uppercase tracking-[0.08em] text-[#7b6847]">
                {item.date}
              </p>
              {view === "visual" && (
                <div className="relative">
                  <span
                    className={`relative z-10 block size-3 border-2 ${item.done ? "border-[#263d32] bg-[#263d32]" : "border-[#b4935a] bg-white"}`}
                  />
                  {index < planningTimeline.length - 1 && (
                    <span className="absolute left-[5px] top-3 h-[calc(100%+24px)] w-px bg-[#c9beae]" />
                  )}
                </div>
              )}
              <div>
                <p className="font-display text-2xl text-[#263d32]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[#6b6d67]">{item.detail}</p>
                {item.done && (
                  <span className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-wider text-[#57705d]">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          <div className="border-b border-[#d8cdbd] bg-[#eee7da] px-5 py-3 text-xs font-semibold text-[#5d625d]">
            Drag items to adjust the sequence. Times remain editable
            independently.
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={dragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item) => (
                <SortableTimelineItem key={item.id} item={item} />
              ))}
            </SortableContext>
          </DndContext>
        </Card>
      )}
    </>
  );
}
