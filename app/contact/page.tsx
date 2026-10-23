import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { ContactSection, PortfolioFooter } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Arvind M for full-time, hybrid, remote, or freelance frontend and automation work.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="secondary-page">
      <SiteHeader activeSection="contact" />
      <div className="page-topbar">
        <Link className="secondary-back" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
      </div>
      <ContactSection />
      <PortfolioFooter />
    </main>
  );
}
