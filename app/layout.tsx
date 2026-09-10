import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AUTHORITATIVE_BUSINESS_NAME, DEFAULT_BUSINESS_SETTINGS } from "@/lib/business-config";

export const viewport: Viewport = {
  themeColor: "#040914",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${AUTHORITATIVE_BUSINESS_NAME} | Bespoke Scuba Diving Expeditions & Master Instruction`,
  description:
    DEFAULT_BUSINESS_SETTINGS.description ||
    "Experience luxury scuba diving, private coral reef safaris, and certified PADI & SSI master instruction in pristine crystal waters.",
  keywords: [
    "luxury diving center",
    "PADI dive master",
    "scuba diving Red Sea",
    "private diving yacht",
    "marine sanctuary",
    "underwater photography dive",
    "Diving Vision Center",
  ],
  authors: [{ name: AUTHORITATIVE_BUSINESS_NAME }],
  openGraph: {
    title: `${AUTHORITATIVE_BUSINESS_NAME} | Bespoke Scuba Diving Expeditions`,
    description: DEFAULT_BUSINESS_SETTINGS.tagline || "Pure ocean expeditions, uncrowded marine sanctuaries, and private master instruction.",
    siteName: AUTHORITATIVE_BUSINESS_NAME,
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: `${AUTHORITATIVE_BUSINESS_NAME} Pristine Reef Sanctuary`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#040914] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
