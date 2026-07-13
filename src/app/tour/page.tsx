"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import { track } from "@/lib/analytics";

const questions = [
  "How do guests move from ceremony to cocktail hour and reception?",
  "What does the venue team handle on the wedding day?",
  "Which decisions have the longest lead times?",
  "How are accessibility and guest transportation typically planned?",
  "When are final guest count and venue details due?",
];

export default function TourPage() {
  const [selectedQuestions, setSelectedQuestions] = useState(
    questions.slice(0, 3),
  );
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("Not toured");
  const [loading, setLoading] = useState(false);
  const request = async (type: "tour" | "information") => {
    setLoading(true);
    track(type === "tour" ? "tour_requested" : "tour_cta_clicked", {
      source: "tour_preparation",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setSubmitted(true);
    toast.success(
      type === "tour"
        ? "Your private tour request has been sent."
        : "Wedding information requested.",
    );
  };

  return (
    <main id="main-content" className="min-h-screen bg-[#f6f1e7]">
      <header className="border-b border-[#3d5146] bg-[#263d32] text-white">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" /> Padua Wedding Planning
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#d8cdbd] hover:text-white"
          >
            Sign in
          </Link>
        </div>
      </header>
      <section className="tile-motif bg-[#263d32] px-5 py-20 text-white sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <MapPin className="mx-auto size-6 text-[#d9c396]" />
          <p className="font-architectural mt-5 text-xs tracking-[0.22em] text-[#d9c396]">
            A MORE USEFUL VISIT
          </p>
          <h1 className="font-display mt-5 text-6xl leading-none sm:text-7xl">
            Prepare for Your Private Tour
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#d9ded9]">
            Bring your priorities and open questions into the estate. We’ll save
            the details so your follow-up starts with context.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1180px] gap-6 px-5 py-12 sm:px-10 lg:grid-cols-[1fr_340px] lg:py-16">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            request("tour");
          }}
          className="grid gap-6"
        >
          <Card className="p-6 sm:p-8">
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              YOUR VISIT AT A GLANCE
            </p>
            <h2 className="font-display mt-2 text-4xl text-[#263d32]">
              The practical frame
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-semibold">
                Your names
                <Input required placeholder="Olivia & Marcus" />
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                Email address
                <Input required type="email" placeholder="you@example.com" />
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                Preferred wedding date
                <Input type="date" />
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                Guest-count estimate
                <Input type="number" placeholder="150" />
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                Budget range
                <Select defaultValue="">
                  <option value="" disabled>
                    Choose a range
                  </option>
                  <option>$40,000–$60,000</option>
                  <option>$60,000–$90,000</option>
                  <option>$90,000–$125,000</option>
                  <option>$125,000+</option>
                  <option>Still determining</option>
                </Select>
              </label>
              <label className="grid gap-2 text-xs font-semibold">
                Date flexibility
                <Select>
                  <option>Exact date</option>
                  <option>Flexible within a month</option>
                  <option>Flexible by season</option>
                  <option>Still exploring</option>
                </Select>
              </label>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              WHAT MATTERS IN THE SPACE
            </p>
            <h2 className="font-display mt-2 text-4xl text-[#263d32]">
              Priorities to bring with you
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {[
                "Ceremony priorities",
                "Reception priorities",
                "Food priorities",
                "Photography priorities",
                "Accessibility needs",
                "Must-haves",
                "Concerns",
                "Tour notes",
              ].map((label) => (
                <label key={label} className="grid gap-2 text-xs font-semibold">
                  <Textarea placeholder={`Add ${label.toLowerCase()}`} />
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              QUESTIONS TO CARRY
            </p>
            <h2 className="font-display mt-2 text-4xl text-[#263d32]">
              Your tour question list
            </h2>
            <div className="mt-6 divide-y divide-[#e1d8ca]">
              {questions.map((question) => (
                <label
                  key={question}
                  className="flex cursor-pointer items-start gap-3 py-4 text-sm leading-6"
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-[#263d32]"
                    checked={selectedQuestions.includes(question)}
                    onChange={(event) =>
                      setSelectedQuestions((current) =>
                        event.target.checked
                          ? [...current, question]
                          : current.filter((item) => item !== question),
                      )
                    }
                  />{" "}
                  {question}
                </label>
              ))}
            </div>
            <label className="mt-5 grid gap-2 text-xs font-semibold">
              Add your own question
              <Input
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    const value = event.currentTarget.value.trim();
                    if (value) {
                      setSelectedQuestions((current) => [...current, value]);
                      event.currentTarget.value = "";
                      toast.success("Question added.");
                    }
                  }
                }}
                placeholder="Type a question and press Enter"
              />
            </label>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Sending request…" : "Book Your Private Tour"}{" "}
              <CalendarDays className="size-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="secondary"
              disabled={loading}
              onClick={() => request("information")}
            >
              Request Wedding Information <Send className="size-4" />
            </Button>
          </div>
          {submitted && (
            <div
              role="status"
              className="flex items-center gap-3 border border-[#7d8b72] bg-[#e8ede5] p-4 text-sm font-semibold text-[#40513f]"
            >
              <CheckCircle2 className="size-5" /> Request received. The Padua
              team will follow up using the email you provided.
            </div>
          )}
        </form>

        <aside className="grid content-start gap-6">
          <Card className="p-6">
            <p className="font-architectural text-[10px] tracking-[0.2em] text-[#806839]">
              AFTER YOUR VISIT
            </p>
            <h2 className="font-display mt-2 text-3xl text-[#263d32]">
              Keep the follow-up clear
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#666962]">
              Update this status as your venue decision develops.
            </p>
            <label className="mt-5 grid gap-2 text-xs font-semibold">
              Tour status
              <Select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  toast.success("Tour status saved.");
                }}
              >
                {[
                  "Not toured",
                  "Tour completed",
                  "Estimate received",
                  "Follow-up requested",
                  "Ready to book",
                  "Still comparing",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </label>
          </Card>
          <Card className="border-l-4 border-l-[#b4935a] p-6">
            <p className="font-display text-2xl text-[#263d32]">
              You do not need every answer.
            </p>
            <p className="mt-3 text-sm leading-6 text-[#666962]">
              The most useful tour clarifies how the estate supports your guest
              count, priorities, and desired flow—not just how each space
              photographs.
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#70736c]">
              Saved questions
            </p>
            <p className="font-display mt-2 text-4xl text-[#263d32]">
              {selectedQuestions.length}
            </p>
            <p className="mt-1 text-xs text-[#777970]">ready for your visit</p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
