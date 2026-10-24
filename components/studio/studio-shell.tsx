"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const InteractiveStudio = dynamic(
  () => import("@/components/world/world").then((module) => module.PortfolioWorld),
  {
    ssr: false,
    loading: () => (
      <main className="studio-loading" aria-live="polite">
        <span>ARVIND / 3D PORTFOLIO</span>
        <div><i /></div>
        <p>Opening the portfolio world…</p>
      </main>
    ),
  },
);

export function StudioShell() {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("fallback") || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWebgl(false);
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);

  if (webgl === null) return <main className="studio-loading"><p>Opening the portfolio…</p></main>;
  return webgl ? <InteractiveStudio /> : <InteractiveStudio forceFallback />;
}
