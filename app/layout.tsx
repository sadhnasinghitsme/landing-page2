import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { content } from "@/lib/content";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Nursery Admission in Noida Sector 137 | CBSE School 2026-27";
const description =
  "SKS World School, Sector 137, Noida Expressway. CBSE co-ed school near Sector 137 Metro. Admissions open Pre-Nursery to Class 5, 2026-27. Enquire today.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sksworldschoolnoida.ac.in"),
  title,
  description,
  keywords: [
    "SKS World School",
    "Noida Sector 137 school",
    "CBSE school Noida Expressway",
    "school admission Noida",
    "best school in Noida Expressway",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    images: [content.images.campus],
  },
  icons: { icon: content.images.logoMark },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B1F3A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
