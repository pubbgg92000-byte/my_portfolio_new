"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/nav/site-header";
import { PortfolioFooter } from "@/components/sections/portfolio-sections";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="secondary-page">
      <SiteHeader />
      <section className="story-section not-found-section" aria-labelledby="error-title">
        <p className="section-kicker">Something went wrong</p>
        <h1 id="error-title">This page hit an error.</h1>
        <p>Try loading it again. If it keeps happening, head back home and the rest of the site will still work.</p>
        <div className="not-found-actions">
          <button type="button" className="hero-button primary" onClick={reset}>
            <RotateCcw aria-hidden="true" />Try again
          </button>
          <Link className="hero-button secondary" href="/">Back home</Link>
        </div>
      </section>
      <PortfolioFooter />
    </main>
  );
}
