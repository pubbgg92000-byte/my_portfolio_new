"use client";

import { ArrowLeft } from "lucide-react";

export function ProjectBackButton() {
  const goBack = () => {
    const stored = window.sessionStorage.getItem("portfolioProjectReturn");

    if (stored) {
      try {
        const position = JSON.parse(stored) as { returnHash?: string };
        if (position.returnHash) {
          window.location.href = `/${position.returnHash}`;
          return;
        }
      } catch {
        window.sessionStorage.removeItem("portfolioProjectReturn");
      }
    }

    window.location.href = "/#projects";
  };

  return (
    <button className="secondary-back" type="button" onClick={goBack}>
      <ArrowLeft aria-hidden="true" />
      Back to projects
    </button>
  );
}
