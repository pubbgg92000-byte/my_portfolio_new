import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Space_Grotesk({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arvind-dev.in";
const previewImage = "/og-image.png";
const title = "Arvind M | Frontend Developer | Software Developer";
const description = "Frontend Developer specializing in Svelte, JavaScript, reusable UI components, responsive web applications, and practical automation with AI tools.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Arvind",
  },
  description,
  applicationName: "Arvind Portfolio",
  authors: [{ name: "Mangalarapu Arvind" }],
  creator: "Mangalarapu Arvind",
  publisher: "Mangalarapu Arvind",
  keywords: [
    "Frontend Developer",
    "Software Developer",
    "Svelte",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "AI Automation",
    "n8n",
    "Portfolio",
    "Hyderabad",
  ],
  category: "portfolio",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Arvind Portfolio",
    title,
    description: "Portfolio showcasing frontend projects, reusable UI components, responsive web applications, technical skills, and practical automation experience.",
    images: [
      {
        url: previewImage,
        width: 1200,
        height: 630,
        alt: "Arvind M portfolio preview with software developer and frontend AI automation branding.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mangalarapu Arvind",
  alternateName: "Arvind M",
  jobTitle: "Software Developer",
  url: siteUrl,
  email: "mailto:mangalarapuarvind@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/pubbgg92000-byte",
    "https://www.linkedin.com/in/mangalarapu-arvind-dev/",
  ],
  knowsAbout: [
    "Frontend Development",
    "Svelte",
    "JavaScript",
    "AI Automation",
    "Reusable UI Components",
    "Modern Web Applications",
  ],
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
        <link
          rel="preload"
          as="image"
          href="/og-image.png"
        />
      </head>
      <body suppressHydrationWarning className={`${geist.variable} ${inter.variable} ${mono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
