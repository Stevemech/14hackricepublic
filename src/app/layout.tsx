import type { Metadata } from "next";
import { DotGothic16, Inter, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// The ASCII-art font (JetBrains Mono) is self-hosted via @font-face in
// globals.css: next/font's latin subsetting strips the box-drawing, block,
// and suit glyphs the art is made of, breaking column alignment.

// Dot-matrix display font for the brand wordmark
const dotGothic = DotGothic16({
  variable: "--font-dotgothic",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Favicon: src/app/icon.svg (gold H on felt), served automatically.
export const metadata: Metadata = {
  title: "JackRice 16 | Rice University",
  description:
    "Rice University's 16th Annual Hackathon — September 11–13, 2026. Join 800+ of the brightest minds in the nation for 36 hours of relentless creation, collaboration, and building!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} ${dotGothic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-felt">
        <div aria-hidden="true" className="dot-grid-overlay" />
        {children}
      </body>
    </html>
  );
}
