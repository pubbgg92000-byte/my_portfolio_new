"use client";

import { useLayoutEffect } from "react";

const SCROLL_KEY = "portfolioHomeScroll";

export function HomeScrollMemory() {
  useLayoutEffect(() => {
    if (window.location.pathname !== "/") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigation?.type === "reload";
    const restoreTimers: number[] = [];
    let savedScrollY: number | null = null;

    try {
      const stored = window.sessionStorage.getItem(SCROLL_KEY);
      const position = stored ? JSON.parse(stored) as { scrollY?: number } : null;
      if (typeof position?.scrollY === "number" && position.scrollY > 4) {
        savedScrollY = position.scrollY;
      }
    } catch {
      window.sessionStorage.removeItem(SCROLL_KEY);
    }

    const restorePosition = () => {
      if (isReload && savedScrollY !== null) {
        window.scrollTo({ top: savedScrollY, behavior: "instant" });
        return;
      }

      if (window.location.hash) {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        target?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    };

    restorePosition();
    restoreTimers.push(
      window.setTimeout(restorePosition, 100),
      window.setTimeout(restorePosition, 300),
      window.setTimeout(restorePosition, 700),
      window.setTimeout(restorePosition, 1200),
    );

    const save = () => {
      window.sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({
          scrollY: window.scrollY,
          savedAt: Date.now(),
        }),
      );
    };

    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);

    return () => {
      restoreTimers.forEach(window.clearTimeout);
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
      save();
    };
  }, []);

  return null;
}
