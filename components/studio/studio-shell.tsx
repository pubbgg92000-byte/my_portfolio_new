"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const InteractiveStudio = dynamic(
  () => import("./city-foundation").then((module) => module.CityFoundation),
  {
    ssr: false,
    loading: () => (
      <main className="studio-loading" aria-live="polite">
        <span>ARVIND / CITY FOUNDATION</span>
        <div><i /></div>
        <p>Preparing the ground plane…</p>
      </main>
    ),
  },
);

export function StudioShell() {
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("fallback")) {
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

  return webgl ? <InteractiveStudio /> : <InteractiveStudio forceFallback />;
}
