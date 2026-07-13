import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[#f6f1e7] px-5 py-10 sm:px-10"
    >
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-[#4d5d51]"
        >
          <ArrowLeft className="size-4" /> Back home
        </Link>
        <p className="font-architectural mt-16 text-xs tracking-[0.2em] text-[#806839]">
          PADUA WEDDING PLANNING
        </p>
        <h1 className="font-display mt-3 text-6xl text-[#263d32]">Privacy</h1>
        <div className="mt-10 grid gap-8 text-sm leading-7 text-[#565a55]">
          <section>
            <h2 className="font-display text-3xl text-[#263d32]">
              Your planning information
            </h2>
            <p className="mt-3">
              Couple workspaces are private. In production, authenticated
              couples can access only their own wedding, assigned Padua staff
              can access only assigned couples, and administrators receive
              access appropriate to their role.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-[#263d32]">
              Documents and messages
            </h2>
            <p className="mt-3">
              Files use private storage with short-lived signed links. Messages
              and support requests are available to the couple and the
              authorized Padua team members helping with that wedding.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-[#263d32]">Analytics</h2>
            <p className="mt-3">
              The application includes a vendor-neutral event interface, but no
              analytics provider or advertising credential is enabled by
              default.
            </p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-[#263d32]">Demo mode</h2>
            <p className="mt-3">
              Without Supabase credentials, this preview uses local browser
              state. Do not enter sensitive personal, payment, or contract
              information into a public preview deployment.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
