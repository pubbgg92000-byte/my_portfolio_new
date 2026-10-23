import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { ExperienceEvolution } from "@/components/experience/experience-evolution";
import { PortfolioFooter } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Journey",
  description: "From mechanical engineering and business operations to frontend development and AI automation: Arvind M's career timeline, milestones, and what's being built now.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return (
    <main className="secondary-page">
      <SiteHeader />
      <div className="page-topbar">
        <Link className="secondary-back" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
      </div>
      <ExperienceEvolution />
      <PortfolioFooter />
    </main>
  );
}
