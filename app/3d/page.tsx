import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/studio-shell";

export const metadata: Metadata = {
  title: "3D Portfolio",
  description: "Explore Arvind's projects, skills, journey, experiments, and contact details through a cinematic interactive 3D portfolio.",
  alternates: { canonical: "/3d" },
};

export default function StudioPage() {
  return <StudioShell />;
}
