"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button, Field, Input, Select } from "@/components/ui";
import { track } from "@/lib/analytics";

const schema = z
  .object({
    partnerOne: z.string().min(1, "Tell us the first name you use."),
    partnerTwo: z.string().min(1, "Add your partner’s name."),
    email: z.email("Enter a valid email address."),
    bookingStatus: z.string().min(1, "Choose the option that fits today."),
    dateCertainty: z.string().min(1),
    weddingDate: z.string().optional(),
    guestCount: z.coerce.number().min(2, "Enter at least 2 guests.").max(1000),
    budget: z.coerce.number().min(1000, "Enter an estimated total budget."),
    ceremonyStyle: z.string().min(1),
    receptionStyle: z
      .string()
      .min(1, "Describe the reception you are considering."),
    priority: z.string().min(1, "Choose what matters most."),
    planningStage: z.string().min(1),
  })
  .superRefine((values, context) => {
    if (values.dateCertainty !== "Still deciding" && !values.weddingDate) {
      context.addIssue({
        code: "custom",
        path: ["weddingDate"],
        message: "Add the date or month you are considering.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

const steps = [
  {
    title: "Let’s begin with you",
    description: "A few details help us shape the right planning space.",
  },
  {
    title: "Set the celebration frame",
    description: "Estimates are useful. You can change every answer later.",
  },
  {
    title: "What should planning protect?",
    description:
      "We’ll use your priorities to surface the next useful decisions.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormInput, object, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bookingStatus: "",
      dateCertainty: "Exact date",
      ceremonyStyle: "",
      priority: "",
      planningStage: "",
    },
  });
  const dateCertainty = useWatch({ control, name: "dateCertainty" });

  const next = async () => {
    const fields: (keyof FormValues)[][] = [
      ["partnerOne", "partnerTwo", "email", "bookingStatus"],
      ["dateCertainty", "weddingDate", "guestCount", "budget"],
    ];
    if (await trigger(fields[step])) setStep((value) => Math.min(2, value + 1));
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    localStorage.setItem("padua-onboarding", JSON.stringify(values));
    track("onboarding_completed", {
      bookingStatus: values.bookingStatus,
      planningStage: values.planningStage,
    });
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/planning/overview?welcome=1");
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f6f1e7] lg:grid lg:grid-cols-[0.7fr_1.3fr]"
    >
      <aside className="relative hidden overflow-hidden bg-[#263d32] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="tile-motif absolute inset-0 opacity-30" />
        <Link href="/" className="relative">
          <span className="font-architectural block text-xs tracking-[0.28em] text-[#d9c396]">
            PADUA
          </span>
          <span className="font-display text-2xl">Wedding Planning</span>
        </Link>
        <div className="relative max-w-md">
          <div className="arch mb-10 h-44 w-32 border border-[#b4935a]/50">
            <div className="arch mx-auto mt-6 h-36 w-20 bg-[#334f40]" />
          </div>
          <blockquote className="font-display text-4xl leading-tight">
            “The clearest plans leave more room to be present.”
          </blockquote>
          <p className="mt-5 text-sm leading-6 text-[#c9c6bd]">
            Your answers create a private workspace that grows with your plans.
          </p>
        </div>
        <p className="relative text-xs text-[#aeb9af]">
          Your information is private and editable.
        </p>
      </aside>

      <section className="flex min-h-screen flex-col">
        <header className="flex h-20 items-center justify-between border-b border-[#d8cdbd] px-5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#445047]"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <span className="font-architectural text-xs tracking-[0.2em] text-[#7b6847]">
            STEP {step + 1} OF 3
          </span>
        </header>
        <div className="h-1 bg-[#e1d8ca]">
          <div
            className="h-full bg-[#a65f45] transition-all"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-5 py-12 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full" noValidate>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a7041]">
              Your planning profile
            </p>
            <h1 className="font-display text-5xl leading-none text-[#263d32] sm:text-6xl">
              {steps[step].title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-[#60615b]">
              {steps[step].description}
            </p>

            {step === 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <Field
                  label="Your first name"
                  error={errors.partnerOne?.message}
                >
                  <Input
                    autoFocus
                    autoComplete="given-name"
                    {...register("partnerOne")}
                  />
                </Field>
                <Field
                  label="Your partner’s first name"
                  error={errors.partnerTwo?.message}
                >
                  <Input {...register("partnerTwo")} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email address" error={errors.email?.message}>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Have you already booked Padua?"
                    error={errors.bookingStatus?.message}
                  >
                    <Select {...register("bookingStatus")}>
                      <option value="">Choose one</option>
                      <option>Yes</option>
                      <option>Not yet</option>
                      <option>We are still exploring</option>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <Field label="How certain is your date?">
                  <Select {...register("dateCertainty")}>
                    <option>Exact date</option>
                    <option>Month and year</option>
                    <option>Still deciding</option>
                  </Select>
                </Field>
                {dateCertainty !== "Still deciding" && (
                  <Field
                    label={
                      dateCertainty === "Month and year"
                        ? "Preferred month"
                        : "Wedding date"
                    }
                    error={errors.weddingDate?.message}
                  >
                    <Input
                      type={
                        dateCertainty === "Month and year" ? "month" : "date"
                      }
                      {...register("weddingDate")}
                    />
                  </Field>
                )}
                <Field
                  label="Estimated guest count"
                  error={errors.guestCount?.message}
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="150"
                    {...register("guestCount")}
                  />
                </Field>
                <Field
                  label="Estimated total budget"
                  error={errors.budget?.message}
                >
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="85000"
                    {...register("budget")}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <Field label="Preferred ceremony style">
                  <Select {...register("ceremonyStyle")}>
                    <option value="">Choose one</option>
                    <option>Outdoor</option>
                    <option>Indoor</option>
                    <option>Not sure</option>
                  </Select>
                </Field>
                <Field
                  label="Preferred reception style"
                  error={errors.receptionStyle?.message}
                >
                  <Input
                    placeholder="Seated dinner and dancing"
                    {...register("receptionStyle")}
                  />
                </Field>
                <Field
                  label="What matters most?"
                  error={errors.priority?.message}
                >
                  <Select {...register("priority")}>
                    <option value="">Choose a priority</option>
                    {[
                      "Food",
                      "Venue atmosphere",
                      "Guest experience",
                      "Photography",
                      "Entertainment",
                      "Budget",
                      "Convenience",
                    ].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Where are you in the planning process?">
                  <Select {...register("planningStage")}>
                    <option value="">Choose one</option>
                    {[
                      "Just started",
                      "Comparing venues",
                      "Venue booked",
                      "Vendors booked",
                      "Finalizing details",
                    ].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-[#d8cdbd] pt-7">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="size-4" /> Previous
              </Button>
              {step < 2 ? (
                <Button type="button" onClick={next}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? "Creating your space…" : "Create planning space"}
                  {!saving && <Check className="size-4" />}
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
