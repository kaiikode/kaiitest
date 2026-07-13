import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://planning.paduaweddings.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Padua Wedding Planning | Your Private Planning Space",
    template: "%s | Padua Wedding Planning",
  },
  description:
    "A personalized wedding planning space built around your date, guest count, priorities, and vision at Padua Weddings.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Plan Your Wedding With Padua",
    description:
      "Organize the details, protect the experience, and plan a celebration that feels like you.",
    url: "/",
    siteName: "Padua Wedding Planning",
    images: [{ url: "/social-preview.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plan Your Wedding With Padua",
    description: "A private digital planning concierge for Padua couples.",
    images: ["/social-preview.svg"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#263D32",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${serif.variable} ${sans.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-20 bg-white px-4 py-3 text-sm font-semibold text-[#263d32] focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { borderRadius: 0, borderColor: "#d8cdbd" } }}
        />
      </body>
    </html>
  );
}
