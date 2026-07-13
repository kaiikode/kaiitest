import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const supportSchema = z.object({
  weddingId: z.uuid(),
  category: z.enum([
    "Estimate Question",
    "Menu Question",
    "Timeline Question",
    "Vendor Question",
    "Payment Question",
    "Final Details",
    "General Help",
  ]),
  subject: z.string().trim().max(180).optional(),
  body: z.string().trim().min(10).max(10000),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Support delivery requires Supabase configuration." },
      { status: 503 },
    );
  }

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rateLimit = await checkRateLimit(`support:${authData.user.id}`, {
    limit: 10,
    windowSeconds: 3600,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Please wait before sending another request." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000),
          ),
        },
      },
    );
  }

  const parsed = supportSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Check the request details.",
        issues: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("messages").insert({
    wedding_id: parsed.data.weddingId,
    sender_id: authData.user.id,
    category: parsed.data.category,
    subject: parsed.data.subject,
    body: parsed.data.body,
  });
  if (error)
    return NextResponse.json(
      { error: "Unable to send this request." },
      { status: 403 },
    );

  return NextResponse.json(
    { ok: true },
    {
      status: 201,
      headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) },
    },
  );
}
