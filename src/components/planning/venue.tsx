"use client";

import { useState } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Heart,
  Landmark,
  Save,
  UtensilsCrossed,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { venueSpaces } from "@/lib/demo-data";
import { SectionHeading } from "./section-heading";

const areas = [
  {
    id: "ceremony",
    title: "Ceremony Vision",
    summary: "Courtyard, processional, traditions and comfort",
    icon: Landmark,
  },
  {
    id: "reception",
    title: "Reception Vision",
    summary: "Dinner, dancing, toasts and evening flow",
    icon: UsersRound,
  },
  {
    id: "guest",
    title: "Guest Experience",
    summary: "Arrival through departure",
    icon: UsersRound,
  },
  {
    id: "food",
    title: "Food & Beverage",
    summary: "Service style, needs and questions",
    icon: UtensilsCrossed,
  },
  {
    id: "photos",
    title: "Photography Locations",
    summary: "Favorite settings and portrait notes",
    icon: Camera,
  },
  {
    id: "entertainment",
    title: "Entertainment",
    summary: "Sound, music and dance-floor priorities",
    icon: Landmark,
  },
  {
    id: "details",
    title: "Final Details",
    summary: "The final decisions that connect the day",
    icon: Check,
  },
];

const fields: Record<
  string,
  {
    label: string;
    type?: "select" | "textarea";
    options?: string[];
    placeholder?: string;
  }[]
> = {
  ceremony: [
    {
      label: "Indoor or outdoor preference",
      type: "select",
      options: ["Outdoor", "Indoor", "Still comparing"],
    },
    { label: "Estimated ceremony time", placeholder: "4:30 PM" },
    { label: "Guest count", placeholder: "150" },
    {
      label: "Processional style",
      placeholder: "Wedding party, family, music cues",
    },
    { label: "Officiant", placeholder: "Name or still deciding" },
    {
      label: "Décor notes",
      type: "textarea",
      placeholder: "Floral, aisle and ceremony focal point ideas",
    },
    { label: "Accessibility considerations", type: "textarea" },
    { label: "Special traditions", type: "textarea" },
  ],
  reception: [
    {
      label: "Reception style",
      type: "select",
      options: [
        "Seated dinner",
        "Cocktail-style",
        "Family-style",
        "Still deciding",
      ],
    },
    { label: "Dining preference" },
    {
      label: "Dance-floor priority",
      type: "select",
      options: ["Central to the evening", "Important", "Relaxed", "Not sure"],
    },
    { label: "Toasts" },
    { label: "Special dances" },
    { label: "Cake cutting" },
    { label: "Late-night plans" },
    { label: "Exit plan" },
  ],
  food: [
    {
      label: "Meal style",
      type: "select",
      options: ["Plated", "Family-style", "Stations", "Still deciding"],
    },
    { label: "Dietary needs", type: "textarea" },
    { label: "Bar preferences", type: "textarea" },
    {
      label: "Signature cocktail interest",
      type: "select",
      options: ["Yes", "No", "Maybe"],
    },
    { label: "Dessert preferences", type: "textarea" },
    { label: "Menu questions", type: "textarea" },
  ],
  guest: [
    { label: "Arrival and welcome", type: "textarea" },
    { label: "Parking and transportation", type: "textarea" },
    { label: "Accessibility", type: "textarea" },
    { label: "Ceremony comfort", type: "textarea" },
    { label: "Cocktail hour", type: "textarea" },
    { label: "Dinner flow", type: "textarea" },
    { label: "Dancing", type: "textarea" },
    { label: "Guest communication", type: "textarea" },
  ],
  entertainment: [
    { label: "Music direction", type: "textarea" },
    {
      label: "DJ or live music",
      type: "select",
      options: ["DJ", "Band", "Both", "Still deciding"],
    },
    { label: "Ceremony sound needs", type: "textarea" },
    { label: "Dinner atmosphere", type: "textarea" },
    { label: "Do-not-play notes", type: "textarea" },
    { label: "Special performances", type: "textarea" },
  ],
  details: [
    { label: "Personal items to place", type: "textarea" },
    { label: "Signage plan", type: "textarea" },
    { label: "Vendor access questions", type: "textarea" },
    { label: "Items returning home", type: "textarea" },
    { label: "Open decisions", type: "textarea" },
    { label: "Coordinator questions", type: "textarea" },
  ],
};

export function VenueSection() {
  const [active, setActive] = useState("ceremony");
  const [favorites, setFavorites] = useState<string[]>([
    "Courtyard",
    "Olive trees",
  ]);
  const [photoNotes, setPhotoNotes] = useState(
    "Prioritize quiet portraits before guest arrival and architectural frames near the courtyard.",
  );
  const activeArea = areas.find((area) => area.id === active)!;

  return (
    <>
      <SectionHeading
        eyebrow="DESIGNED FOR PADUA"
        title="Venue Planning"
        description="Translate your vision into the practical questions that help your coordinator understand the full guest experience."
        action={
          <Button onClick={() => toast.success(`${activeArea.title} saved.`)}>
            <Save className="size-4" /> Save section
          </Button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <nav
          className="grid content-start gap-2 sm:grid-cols-2 xl:grid-cols-1"
          aria-label="Venue planning areas"
        >
          {areas.map(({ id, title, summary, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex min-h-20 items-center gap-3 border p-4 text-left transition-colors ${active === id ? "border-[#263d32] bg-[#263d32] text-white" : "border-[#d8cdbd] bg-white text-[#30352f] hover:border-[#7d8b72]"}`}
            >
              <Icon
                className={`size-5 shrink-0 ${active === id ? "text-[#d9c396]" : "text-[#a65f45]"}`}
                strokeWidth={1.6}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{title}</span>
                <span
                  className={`mt-1 block text-xs leading-4 ${active === id ? "text-[#c8d0ca]" : "text-[#73756f]"}`}
                >
                  {summary}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0" />
            </button>
          ))}
        </nav>

        <Card className="p-5 sm:p-7">
          <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
            YOUR PREFERENCES
          </p>
          <h2 className="font-display mt-2 text-4xl text-[#263d32]">
            {activeArea.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#696b65]">
            Add what you know today. Unanswered questions can stay open until
            your next conversation.
          </p>

          {active === "photos" ? (
            <div className="mt-8">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {venueSpaces.map((space, index) => {
                  const favorite = favorites.includes(space.name);
                  return (
                    <button
                      key={space.name}
                      onClick={() =>
                        setFavorites((current) =>
                          favorite
                            ? current.filter((name) => name !== space.name)
                            : [...current, space.name],
                        )
                      }
                      className={`group min-h-44 border p-5 text-left ${favorite ? "border-[#b4935a] bg-[#f3ede2]" : "border-[#d8cdbd] bg-white"}`}
                    >
                      <div className="flex justify-between">
                        <span className="font-architectural text-[10px] tracking-[0.15em] text-[#806839]">
                          LOCATION {index + 1}
                        </span>
                        <Heart
                          className={`size-4 ${favorite ? "text-[#a65f45]" : "text-[#99998f]"}`}
                          fill={favorite ? "currentColor" : "none"}
                        />
                      </div>
                      <p className="font-display mt-6 text-2xl text-[#263d32]">
                        {space.name}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#6d6f69]">
                        {space.detail}
                      </p>
                    </button>
                  );
                })}
              </div>
              <label className="mt-6 grid gap-2 text-xs font-semibold">
                Photography notes
                <Textarea
                  value={photoNotes}
                  onChange={(event) => setPhotoNotes(event.target.value)}
                />
              </label>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                toast.success(`${activeArea.title} saved.`);
              }}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              {(fields[active] ?? []).map((field) => (
                <label
                  key={field.label}
                  className={`grid gap-2 text-xs font-semibold ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
                >
                  {field.label}
                  {field.type === "select" ? (
                    <Select defaultValue="">
                      <option value="" disabled>
                        Choose one
                      </option>
                      {field.options?.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea placeholder={field.placeholder || "Add notes"} />
                  ) : (
                    <Input placeholder={field.placeholder || "Add details"} />
                  )}
                </label>
              ))}
              <div className="sm:col-span-2">
                <Button type="submit">
                  <Save className="size-4" /> Save{" "}
                  {activeArea.title.toLowerCase()}
                </Button>
              </div>
            </form>
          )}
          {active === "food" && (
            <p className="mt-6 border-l-2 border-[#b4935a] bg-[#f4efe5] p-4 text-xs leading-5 text-[#62645e]">
              Your Padua coordinator will confirm availability, pricing, and
              final selections.
            </p>
          )}
        </Card>
      </div>
    </>
  );
}
