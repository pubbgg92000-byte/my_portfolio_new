import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { PortfolioFooter } from "@/components/sections/portfolio-sections";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="secondary-page">
      <SiteHeader />
      <section className="story-section not-found-section" aria-labelledby="not-found-title">
        <p className="section-kicker">404</p>
        <h1 id="not-found-title">This page doesn&apos;t exist.</h1>
        <p>The link may be outdated or the project may have moved. Head back home or jump straight to the work.</p>
        <div className="not-found-actions">
          <Link className="hero-button primary" href="/"><ArrowLeft aria-hidden="true" />Back home</Link>
          <Link className="hero-button secondary" href="/#projects">View projects</Link>
        </div>
      </section>
      <PortfolioFooter />
    </main>
  );
}
