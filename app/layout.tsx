import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Space_Grotesk({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-portfolio-new.vercel.app";
const previewImage = "/images/robot-frames/frame_000000.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arvind | AI-Powered Frontend Engineer",
    template: "%s | Arvind",
  },
  description: "I design and build polished product interfaces, internal tools, business websites, and AI-assisted digital experiences with thoughtful motion and scalable engineering.",
  applicationName: "Arvind Portfolio",
  authors: [{ name: "Mangalarapu Arvind" }],
  creator: "Mangalarapu Arvind",
  publisher: "Mangalarapu Arvind",
  keywords: [
    "Arvind",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "AI Automation",
    "Full Stack Developer",
    "Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Arvind Portfolio",
    title: "Arvind | AI-Powered Frontend Engineer",
    description: "Polished product interfaces, internal tools, business websites, and AI-assisted digital experiences built with React, Next.js, and automation workflows.",
    images: [
      {
        url: previewImage,
        width: 1280,
        height: 720,
        alt: "Arvind portfolio hero preview with animated AI robot visual.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arvind | AI-Powered Frontend Engineer",
    description: "React, Next.js, AI automation, and polished product interfaces by Mangalarapu Arvind.",
    images: [previewImage],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body suppressHydrationWarning className={`${geist.variable} ${inter.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
