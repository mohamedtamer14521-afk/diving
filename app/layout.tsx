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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://divingvisioncenter.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Diving Vision Center | Premier PADI 5-Star Dive Center Sharm El-Sheikh, Red Sea",
    template: "%s | Diving Vision Center Sharm El-Sheikh",
  },
  description:
    "Official website of Diving Vision Center in Sharm El-Sheikh, Egypt. Premier PADI 5-Star dive center offering daily boat trips to Ras Mohammed, SS Thistlegorm, Straits of Tiran, Dahab Blue Hole, and certified PADI courses.",
  keywords: [
    "Diving Vision Center",
    "Diving Vision Sharm El Sheikh",
    "Diving in Sharm El Sheikh",
    "Scuba diving Sharm El Sheikh",
    "PADI dive center Sharm El Sheikh",
    "Ras Mohammed diving trip",
    "SS Thistlegorm wreck dive",
    "Straits of Tiran boat safari",
    "Dahab Blue Hole diving excursion",
    "PADI Open Water course Sharm",
    "Red Sea scuba diving Egypt",
    "VIP private dive boat charter Sharm",
    "غوص شرم الشيخ",
    "مركز غوص شرم الشيخ",
    "رحلات غوص رأس محمد",
    "كورسات غوص معتمدة PADI شرم الشيخ",
  ],
  authors: [{ name: "Diving Vision Center", url: siteUrl }],
  creator: "Diving Vision Center",
  publisher: "Diving Vision Center",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Diving Vision Center | PADI 5-Star Dive Center Sharm El-Sheikh",
    description:
      "Daily Red Sea boat safaris to Ras Mohammed, SS Thistlegorm & Tiran. Certified PADI courses from Beginner to Divemaster. Reserve direct with local divemasters.",
    url: siteUrl,
    siteName: "Diving Vision Center",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Diving Vision Center - Sharm El-Sheikh Red Sea Diving",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diving Vision Center | Sharm El-Sheikh Red Sea Diving",
    description:
      "Premier PADI 5-Star Dive Center in Sharm El-Sheikh. Ras Mohammed safaris, SS Thistlegorm wreck expeditions, and PADI certifications.",
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop"],
  },
  verification: {
    google: ["googlebc663518735825d8", "googleaceb123692234863"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data for Google Rich Results (LocalBusiness & SportsActivityLocation)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness", "TouristAttraction"],
    "@id": `${siteUrl}/#organization`,
    name: "Diving Vision Center",
    alternateName: ["Diving Vision Sharm", "Diving Vision Dive Center"],
    description:
      "Premier PADI 5-Star Dive Resort #34281 in Sharm El-Sheikh, South Sinai, Egypt. Daily boat diving to Ras Mohammed National Park, Straits of Tiran, SS Thistlegorm, and PADI courses.",
    url: siteUrl,
    telephone: "+201008924410",
    priceRange: "€€",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Naama Bay Marine Road, Jetty Sector",
      addressLocality: "Sharm El-Sheikh",
      addressRegion: "South Sinai",
      postalCode: "46619",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.9158,
      longitude: 34.3299,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Diving Safaris and PADI Certification Programs",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ras Mohammed National Park Boat Safari",
            description: "Full day boat safari to Shark & Yolanda Reef with lunch, guide, and 12L tanks included.",
          },
          price: "85",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "PADI Open Water Diver Certification",
            description: "World-recognized 3-4 day certification course with PADI eLearning and 4 open water dives.",
          },
          price: "360",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SS Thistlegorm Historic WW2 Wreck Safari",
            description: "Early morning 2-dive safari on the world's most famous WW2 shipwreck.",
          },
          price: "165",
          priceCurrency: "EUR",
        },
      ],
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#040914] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
