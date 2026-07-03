import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Space_Grotesk({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Arvind — Product Engineer",
  description: "AI engineer, full-stack developer, and automation builder creating thoughtful digital products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/robot-frames/frame_000000.png"
          fetchPriority="high"
        />
      </head>
      <body className={`${geist.variable} ${inter.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
