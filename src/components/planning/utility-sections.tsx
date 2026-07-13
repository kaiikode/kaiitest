"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  MessageSquareText,
  Paperclip,
  Phone,
  Pin,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { couple, notes as initialNotes } from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SectionHeading } from "./section-heading";

export function NotesSection() {
  const [notes, setNotes] = usePersistentState("notes", initialNotes);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    category: "General",
    content: "",
  });
  return (
    <>
      <SectionHeading
        eyebrow="KEEP CONTEXT CLOSE"
        title="Notes"
        description="Capture decisions, questions, and ideas without losing why they matter."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> New note
          </Button>
        }
      />
      {showAdd && (
        <Card className="mb-6 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.title || !draft.content)
                return toast.error("Add a title and note.");
              setNotes((current) => [
                {
                  id: crypto.randomUUID(),
                  title: draft.title,
                  category: draft.category,
                  date: "Jul 13, 2026",
                  content: draft.content,
                  pinned: false,
                },
                ...current,
              ]);
              setDraft({ title: "", category: "General", content: "" });
              setShowAdd(false);
              toast.success("Note saved.");
            }}
            className="grid gap-4 sm:grid-cols-2"
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
              Category
              <Select
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value })
                }
              >
                {[
                  "General",
                  "Venue",
                  "Guest Experience",
                  "Photography",
                  "Food",
                  "Vendors",
                  "Budget",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Note
              <Textarea
                value={draft.content}
                onChange={(event) =>
                  setDraft({ ...draft, content: event.target.value })
                }
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">Save note</Button>
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
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <Card
            key={note.id}
            className={
              note.pinned ? "border-t-4 border-t-[#b4935a] p-5" : "p-5"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge tone="stone">{note.category}</Badge>
                <h2 className="font-display mt-4 text-2xl text-[#263d32]">
                  {note.title}
                </h2>
              </div>
              <button
                aria-label={`${note.pinned ? "Unpin" : "Pin"} ${note.title}`}
                onClick={() =>
                  setNotes((current) =>
                    current.map((item) =>
                      item.id === note.id
                        ? { ...item, pinned: !item.pinned }
                        : item,
                    ),
                  )
                }
                className={note.pinned ? "text-[#a65f45]" : "text-[#90918a]"}
              >
                <Pin
                  className="size-4"
                  fill={note.pinned ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#60635e]">
              {note.content}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-[#e1d8ca] pt-4">
              <time className="text-xs text-[#777970]">{note.date}</time>
              <Button
                variant="quiet"
                size="icon"
                aria-label={`Delete ${note.title}`}
                onClick={() => {
                  setNotes((current) =>
                    current.filter((item) => item.id !== note.id),
                  );
                  toast.success("Note removed.");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </>
  );
}

type MockDocument = {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
};

export function DocumentsSection() {
  const [documents, setDocuments] = usePersistentState<MockDocument[]>(
    "documents",
    [
      {
        id: "d1",
        name: "Padua venue agreement.pdf",
        category: "Contracts",
        size: "2.4 MB",
        date: "Jul 10, 2026",
      },
      {
        id: "d2",
        name: "Photography estimate.pdf",
        category: "Estimates",
        size: "842 KB",
        date: "Jul 8, 2026",
      },
      {
        id: "d3",
        name: "Courtyard inspiration.jpg",
        category: "Inspiration files",
        size: "1.1 MB",
        date: "Jul 6, 2026",
      },
    ],
  );
  const [category, setCategory] = useState("Contracts");
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = (files?: FileList | null) => {
    if (!files?.length) return;
    const added = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      category,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      date: "Jul 13, 2026",
    }));
    setDocuments((current) => [...added, ...current]);
    toast.success(
      `${added.length} document${added.length > 1 ? "s" : ""} added to local demo storage.`,
    );
  };
  return (
    <>
      <SectionHeading
        eyebrow="YOUR SHARED RECORD"
        title="Documents"
        description="Keep contracts, estimates, plans, menus, timelines, and insurance documents attached to your workspace."
        action={
          <>
            <input
              ref={fileInput}
              className="hidden"
              type="file"
              multiple
              onChange={(event) => upload(event.target.files)}
            />
            <Button onClick={() => fileInput.current?.click()}>
              <Upload className="size-4" /> Upload files
            </Button>
          </>
        }
      />
      <Card className="mb-6 flex flex-col justify-between gap-4 border-l-4 border-l-[#7d8b72] p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 text-[#506554]" />
          <div>
            <p className="text-sm font-semibold">Private workspace access</p>
            <p className="mt-1 text-xs leading-5 text-[#6b6e68]">
              Production uploads use signed Supabase Storage URLs and
              wedding-member authorization. This demo keeps filenames only in
              your browser session.
            </p>
          </div>
        </div>
        <Select
          className="sm:max-w-52"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {[
            "Contracts",
            "Estimates",
            "Inspiration files",
            "Vendor documents",
            "Floor plans",
            "Menus",
            "Timelines",
            "Insurance documents",
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
      </Card>
      <Card>
        <div className="border-b border-[#d8cdbd] px-5 py-4">
          <h2 className="font-display text-2xl text-[#263d32]">Your files</h2>
        </div>
        <div className="divide-y divide-[#e1d8ca]">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center gap-4 bg-white p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center bg-[#eee7da] text-[#59695d]">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {document.name}
                </p>
                <p className="mt-1 text-xs text-[#777970]">
                  {document.category} · {document.size} · {document.date}
                </p>
              </div>
              <Button
                variant="quiet"
                size="icon"
                aria-label={`Download ${document.name}`}
                onClick={() =>
                  toast.info(
                    "Connect Supabase Storage to download this demo document.",
                  )
                }
              >
                <Download className="size-4" />
              </Button>
              <Button
                variant="quiet"
                size="icon"
                aria-label={`Remove ${document.name}`}
                onClick={() => {
                  setDocuments((current) =>
                    current.filter((item) => item.id !== document.id),
                  );
                  toast.success("Document removed.");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function TeamSection() {
  const [category, setCategory] = useState("General Help");
  const [message, setMessage] = useState("");
  const [history, setHistory] = usePersistentState("message-history", [
    {
      from: "Claire Bennett",
      subject: "Your planning introduction",
      date: "Jul 11",
      body: "I’m looking forward to helping you shape the details at Padua.",
    },
    {
      from: "Olivia & Marcus",
      subject: "Courtyard ceremony timing",
      date: "Jul 9",
      body: "Could we discuss the best ceremony time for October light?",
    },
  ]);
  return (
    <>
      <SectionHeading
        eyebrow="A STRUCTURED LINE TO THE VENUE"
        title="Padua Team"
        description="Bring your question to the right person with enough context for a thoughtful answer."
      />
      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="grid content-start gap-5">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#72746d]">
              Assigned coordinator
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex size-14 items-center justify-center bg-[#263d32] font-display text-xl text-white">
                CB
              </span>
              <div>
                <p className="font-display text-2xl text-[#263d32]">
                  Claire Bennett
                </p>
                <p className="text-xs text-[#73756e]">
                  Padua Wedding Coordinator
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 border-t border-[#e1d8ca] pt-5 text-sm">
              <a
                href="mailto:planning@paduaweddings.com"
                className="flex items-center gap-3 hover:underline"
              >
                <Mail className="size-4 text-[#a65f45]" />{" "}
                planning@paduaweddings.com
              </a>
              <a
                href="tel:+19095550188"
                className="flex items-center gap-3 hover:underline"
              >
                <Phone className="size-4 text-[#a65f45]" /> (909) 555-0188
              </a>
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#72746d]">
              Upcoming meeting
            </p>
            <p className="font-display mt-3 text-3xl text-[#263d32]">
              Planning introduction
            </p>
            <p className="mt-2 text-sm text-[#666962]">
              August 14, 2026 · 2:00 PM
            </p>
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() =>
                toast.success("Calendar file prepared for download.")
              }
            >
              Add to calendar
            </Button>
          </Card>
        </div>
        <div className="grid gap-5">
          <Card className="p-6">
            <h2 className="font-display text-3xl text-[#263d32]">
              Request assistance
            </h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (message.length < 10)
                  return toast.error(
                    "Add a little more detail so the team can help.",
                  );
                setHistory((current) => [
                  {
                    from: couple.names,
                    subject: category,
                    date: "Just now",
                    body: message,
                  },
                  ...current,
                ]);
                setMessage("");
                track("support_request_submitted", { category });
                toast.success("Your request has been sent to the Padua team.");
              }}
              className="mt-5 grid gap-4"
            >
              <label className="grid gap-2 text-xs font-semibold">
                Request category
                <Select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {[
                    "Estimate Question",
                    "Menu Question",
                    "Timeline Question",
                    "Vendor Question",
                    "Payment Question",
                    "Final Details",
                    "General Help",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                How can we help?
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Include the decision, date, or document this relates to."
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold text-[#5a665c]">
                  <Paperclip className="size-4" /> Attach document
                  <input
                    className="sr-only"
                    type="file"
                    onChange={(event) =>
                      event.target.files?.[0] &&
                      toast.success(`${event.target.files[0].name} attached.`)
                    }
                  />
                </label>
                <Button type="submit">
                  <MessageSquareText className="size-4" /> Send request
                </Button>
              </div>
            </form>
          </Card>
          <Card>
            <div className="border-b border-[#d8cdbd] px-6 py-5">
              <h2 className="font-display text-2xl text-[#263d32]">
                Message history
              </h2>
            </div>
            <div className="divide-y divide-[#e1d8ca]">
              {history.map((item, index) => (
                <article key={`${item.date}-${index}`} className="p-6">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.subject}</p>
                      <p className="mt-1 text-xs text-[#74766f]">{item.from}</p>
                    </div>
                    <time className="text-xs text-[#777970]">{item.date}</time>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#62645e]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

export function FinalDetailsSection() {
  const [done, setDone] = usePersistentState<string[]>("final-details", [
    "Final walkthrough scheduled",
  ]);
  const items = [
    "Final walkthrough scheduled",
    "Final guest count submitted",
    "Vendor insurance received",
    "Wedding-day timeline approved",
    "Personal items list complete",
    "Transportation confirmed",
    "Emergency contacts shared",
  ];
  return (
    <>
      <SectionHeading
        eyebrow="THE LAST CONNECTING DECISIONS"
        title="Final Details"
        description="A focused handoff for the practical information your Padua team needs as the wedding approaches."
        action={
          <Button onClick={() => toast.success("Final details saved.")}>
            <CheckCircle2 className="size-4" /> Save progress
          </Button>
        }
      />
      <Card>
        <div className="border-b border-[#d8cdbd] p-6">
          <div className="flex justify-between text-sm font-semibold">
            <span>Final-detail readiness</span>
            <span>{Math.round((done.length / items.length) * 100)}%</span>
          </div>
          <div className="mt-3 h-2 bg-[#e4ddd1]">
            <div
              className="h-full bg-[#7d8b72]"
              style={{ width: `${(done.length / items.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="divide-y divide-[#e1d8ca]">
          {items.map((item) => (
            <label
              key={item}
              className="flex min-h-16 cursor-pointer items-center gap-4 bg-white px-6"
            >
              <input
                type="checkbox"
                checked={done.includes(item)}
                onChange={(event) =>
                  setDone((current) =>
                    event.target.checked
                      ? [...current, item]
                      : current.filter((value) => value !== item),
                  )
                }
                className="size-4 accent-[#263d32]"
              />
              <span
                className={
                  done.includes(item)
                    ? "text-sm text-[#74766f] line-through"
                    : "text-sm font-semibold"
                }
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      </Card>
    </>
  );
}

export function SettingsSection() {
  return (
    <>
      <SectionHeading
        eyebrow="YOUR WORKSPACE"
        title="Settings"
        description="Keep your profile, wedding assumptions, access, and notifications current."
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Workspace settings saved.");
        }}
        className="grid gap-6 xl:grid-cols-2"
      >
        <Card className="p-6">
          <h2 className="font-display text-3xl text-[#263d32]">
            Couple profile
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-semibold">
              Partner one
              <Input defaultValue="Olivia" />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Partner two
              <Input defaultValue="Marcus" />
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Email
              <Input type="email" defaultValue="olivia@example.com" />
            </label>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-display text-3xl text-[#263d32]">
            Wedding profile
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-semibold">
              Wedding date
              <Input type="date" defaultValue={couple.weddingDate} />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Guest count
              <Input type="number" defaultValue={couple.guestCount} />
            </label>
            <label className="grid gap-2 text-xs font-semibold sm:col-span-2">
              Booking status
              <Select defaultValue="Venue Booked">
                <option>Exploring</option>
                <option>Tour requested</option>
                <option>Venue Booked</option>
              </Select>
            </label>
          </div>
        </Card>
        <Card className="p-6 xl:col-span-2">
          <h2 className="font-display text-3xl text-[#263d32]">
            Notifications & access
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              "Email me about upcoming deadlines",
              "Email me when the Padua team replies",
              "Share workspace activity with my partner",
              "Include monthly planning summaries",
            ].map((label, index) => (
              <label
                key={label}
                className="flex min-h-12 items-center gap-3 border border-[#d8cdbd] bg-white px-4 text-sm"
              >
                <input
                  type="checkbox"
                  defaultChecked={index < 3}
                  className="size-4 accent-[#263d32]"
                />{" "}
                {label}
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between border-t border-[#e1d8ca] pt-6">
            <Button
              type="button"
              variant="danger"
              onClick={() =>
                toast.info(
                  "Account deletion requires email confirmation and was not started.",
                )
              }
            >
              Delete workspace
            </Button>
            <Button type="submit">Save settings</Button>
          </div>
        </Card>
      </form>
    </>
  );
}

export function TourPromptSection() {
  return (
    <Card className="p-8 text-center">
      <MapPin className="mx-auto size-6 text-[#a65f45]" />
      <h2 className="font-display mt-4 text-3xl text-[#263d32]">
        Still considering Padua?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#666861]">
        Prepare your questions, priorities, preferred dates, and guest estimate
        before a private visit.
      </p>
      <Button asChild className="mt-6">
        <Link href="/tour">Prepare for a private tour</Link>
      </Button>
    </Card>
  );
}
