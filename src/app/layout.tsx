import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Sri Arumugam Pyro Park | Sivakasi Diwali Crackers Online",
  description: "Buy Diwali crackers and gift boxes online at Sri Arumugam Pyro Park, Sivakasi. Best quality Sivakasi crackers at wholesale prices. WhatsApp: 8682913516",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
