import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { CertificationsSection, PortfolioFooter } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Courses, training, and self-directed learning milestones from Arvind M across frontend development, automation testing, and AI tooling.",
  alternates: { canonical: "/certifications" },
};

export default function CertificationsPage() {
  return (
    <main className="secondary-page">
      <SiteHeader />
      <div className="page-topbar">
        <Link className="secondary-back" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
      </div>
      <CertificationsSection />
      <PortfolioFooter />
    </main>
  );
}
