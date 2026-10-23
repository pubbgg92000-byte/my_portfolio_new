import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { PortfolioFooter, ResumeSection } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Resume",
  description: "Preview or download Arvind M's resume: frontend developer experience, education, and skills across React, Svelte, JavaScript, and AI automation.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <main className="secondary-page">
      <SiteHeader />
      <div className="page-topbar">
        <Link className="secondary-back" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
      </div>
      <ResumeSection />
      <PortfolioFooter />
    </main>
  );
}
