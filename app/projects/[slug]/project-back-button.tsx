"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export function ProjectBackButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const goBack = () => {
    let target = "/#projects";
    const stored = window.sessionStorage.getItem("portfolioProjectReturn");

    if (stored) {
      try {
        const position = JSON.parse(stored) as { returnHash?: string };
        if (position.returnHash) target = `/${position.returnHash}`;
      } catch {
        window.sessionStorage.removeItem("portfolioProjectReturn");
      }
    }

    // Client-side navigation keeps cached chunks and avoids a full reload.
    startTransition(() => router.push(target));
  };

  return (
    <button className="secondary-back" type="button" onClick={goBack} disabled={pending} aria-busy={pending}>
      {pending ? <Loader2 className="spin" aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
      {pending ? "Loading…" : "Back to projects"}
    </button>
  );
}
