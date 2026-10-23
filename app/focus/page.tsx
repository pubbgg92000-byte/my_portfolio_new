import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { CurrentFocusSection, LearningNowSection, PortfolioFooter } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Current focus",
  description: "What Arvind M is learning and building right now: React, Next.js, AI agents, automation workflows, and interactive web products.",
  alternates: { canonical: "/focus" },
};

export default function FocusPage() {
  return (
    <main className="secondary-page">
      <SiteHeader />
      <div className="page-topbar">
        <Link className="secondary-back" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
      </div>
      <LearningNowSection />
      <CurrentFocusSection />
      <PortfolioFooter />
    </main>
  );
}
