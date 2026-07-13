"use client";

import { useRef, useState } from "react";
import { Heart, Link2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { inspiration as initialInspiration } from "@/lib/demo-data";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SectionHeading } from "./section-heading";

type InspirationItem = (typeof initialInspiration)[number] & {
  notes?: string;
  source?: string;
  tags?: string[];
  favorite?: boolean;
};

export function InspirationSection() {
  const [items, setItems] = usePersistentState<InspirationItem[]>(
    "inspiration",
    initialInspiration,
  );
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    image: "",
    title: "",
    category: "Ceremony",
    notes: "",
    source: "",
    tags: "",
    color: "#7d8b72",
  });
  const uploadRef = useRef<HTMLInputElement>(null);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title || !draft.image)
      return toast.error("Add a title and image URL or upload.");
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title: draft.title,
        category: draft.category,
        color: draft.color,
        image: draft.image,
        notes: draft.notes,
        source: draft.source,
        tags: draft.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        favorite: false,
      },
    ]);
    setDraft({
      image: "",
      title: "",
      category: "Ceremony",
      notes: "",
      source: "",
      tags: "",
      color: "#7d8b72",
    });
    setShowAdd(false);
    toast.success("Inspiration saved.");
  };

  return (
    <>
      <SectionHeading
        eyebrow="A VISUAL LANGUAGE FOR YOUR DAY"
        title="Inspiration"
        description="Collect references with enough context to turn a beautiful image into a useful planning decision."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> Save inspiration
          </Button>
        }
      />

      {showAdd && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={save}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Image URL
              <Input
                type="url"
                placeholder="https://…"
                value={draft.image}
                onChange={(event) =>
                  setDraft({ ...draft, image: event.target.value })
                }
              />
            </label>
            <div className="flex items-end">
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setDraft({ ...draft, image: URL.createObjectURL(file) });
                    toast.success("Image ready to save.");
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => uploadRef.current?.click()}
              >
                <Upload className="size-4" /> Upload image
              </Button>
            </div>
            <label className="grid gap-2 text-xs font-semibold">
              Palette color
              <Input
                type="color"
                className="p-1"
                value={draft.color}
                onChange={(event) =>
                  setDraft({ ...draft, color: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Title
              <Input
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
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
                  "Ceremony",
                  "Reception",
                  "Florals",
                  "Color Palette",
                  "Table Design",
                  "Attire",
                  "Photography",
                  "Invitations",
                  "Cake",
                  "Entertainment",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Source URL
              <Input
                type="url"
                value={draft.source}
                onChange={(event) =>
                  setDraft({ ...draft, source: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Tags
              <Input
                placeholder="warm, candlelight"
                value={draft.tags}
                onChange={(event) =>
                  setDraft({ ...draft, tags: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2 lg:col-span-4">
              Notes
              <Textarea
                value={draft.notes}
                onChange={(event) =>
                  setDraft({ ...draft, notes: event.target.value })
                }
              />
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
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

      <Card className="mb-6 p-5">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#71736c]">
              Your emerging palette
            </p>
            <p className="mt-2 text-sm text-[#666861]">
              Generated from colors saved with your visual references.
            </p>
          </div>
          <div className="flex" aria-label="Saved color palette">
            {items.slice(0, 6).map((item) => (
              <span
                key={item.id}
                className="block size-10 border border-white sm:size-12"
                style={{ background: item.color }}
                title={`${item.title}: ${item.color}`}
              />
            ))}
          </div>
        </div>
      </Card>

      <section className="columns-1 gap-5 sm:columns-2 xl:columns-3">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className="mb-5 break-inside-avoid overflow-hidden"
          >
            <div
              className={`relative overflow-hidden ${index % 3 === 1 ? "h-80" : "h-60"}`}
            >
              {/* User-selected and remote inspiration sources are intentionally rendered as content images. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() =>
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, favorite: !entry.favorite }
                        : entry,
                    ),
                  )
                }
                className={`absolute right-3 top-3 flex size-10 items-center justify-center bg-white/95 ${item.favorite ? "text-[#a65f45]" : "text-[#4f554f]"}`}
                aria-label={`${item.favorite ? "Remove" : "Add"} ${item.title} ${item.favorite ? "from" : "to"} favorites`}
              >
                <Heart
                  className="size-5"
                  fill={item.favorite ? "currentColor" : "none"}
                />
              </button>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#806839]">
                {item.category}
              </p>
              <h2 className="font-display mt-2 text-2xl text-[#263d32]">
                {item.title}
              </h2>
              {item.notes && (
                <p className="mt-2 text-sm leading-6 text-[#686a64]">
                  {item.notes}
                </p>
              )}
              {item.source && (
                <a
                  href={item.source}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#576b5b] hover:underline"
                >
                  <Link2 className="size-3" /> View source
                </a>
              )}
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}
