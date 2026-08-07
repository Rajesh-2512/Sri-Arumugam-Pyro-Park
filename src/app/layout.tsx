import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sriarumugampyropark.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f59e0b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Sri Arumugam Pyro Park | Buy Sivakasi Crackers Online | Diwali Fireworks Direct Factory Outlet",
    template: "%s | Sri Arumugam Pyro Park Sivakasi",
  },

  description:
    "Buy Sivakasi Diwali crackers & fireworks online at Sri Arumugam Pyro Park — direct factory outlet prices. Wholesale & retail crackers, gift boxes, sparklers, flower pots, fancy crackers, sound crackers & more. WhatsApp: 8682913516. Free transport across India.",

  keywords: [
    "sivakasi crackers",
    "sivakasi crackers online",
    "buy diwali crackers online",
    "crackers online shopping",
    "diwali crackers",
    "crackers wholesale sivakasi",
    "sivakasi crackers factory outlet",
    "diwali fireworks online",
    "buy crackers direct from sivakasi",
    "crackers shop sivakasi",
    "best crackers shop sivakasi",
    "sivakasi crackers delivery",
    "tamil nadu crackers online",
    "sri arumugam pyro park",
    "arumugam crackers sivakasi",
    "crackers gift box online",
    "diwali crackers 2025",
    "diwali crackers 2026",
    "sparklers online",
    "flower pots crackers",
    "fancy crackers sivakasi",
    "sound crackers online",
    "rockets crackers online",
    "bombs crackers sivakasi",
    "wholesale fireworks india",
    "crackers online order",
    "sivakasi fireworks",
    "crackers factory price",
    "online crackers shop india",
  ],

  authors: [{ name: "Sri Arumugam Pyro Park", url: SITE_URL }],
  creator: "Sri Arumugam Pyro Park",
  publisher: "Sri Arumugam Pyro Park",

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

  icons: {
    icon: [
      { url: "/sriarumugam-creative-favicon.png?v=11", type: "image/png" },
      { url: "/favicon.ico?v=11" },
    ],
    shortcut: "/sriarumugam-creative-favicon.png?v=11",
    apple: "/sriarumugam-creative-favicon.png?v=11",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Sri Arumugam Pyro Park",
    title:
      "Sri Arumugam Pyro Park | Buy Sivakasi Diwali Crackers Online at Factory Outlet Prices",
    description:
      "Direct factory outlet for Sivakasi Diwali crackers & fireworks. Buy sparklers, flower pots, fancy crackers, sound crackers, rockets, gift boxes & more online at wholesale prices. WhatsApp: 8682913516.",
    images: [
      {
        url: "/banner-main.png",
        width: 1200,
        height: 630,
        alt: "Sri Arumugam Pyro Park — Sivakasi Diwali Crackers Online Shop",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Sri Arumugam Pyro Park | Buy Sivakasi Diwali Crackers Online",
    description:
      "Direct Sivakasi factory outlet. Buy Diwali crackers, fireworks gift boxes, sparklers & more online at wholesale prices.",
    images: ["/banner-main.png"],
    creator: "@SAPP_SIVAKASI",
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "Fireworks & Crackers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/sriarumugam-creative-favicon.png?v=11" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/sriarumugam-creative-favicon.png?v=11" />
        <link rel="apple-touch-icon" href="/sriarumugam-creative-favicon.png?v=11" />
      </head>
      <body
        className="min-h-full flex flex-col font-sans"
        style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
