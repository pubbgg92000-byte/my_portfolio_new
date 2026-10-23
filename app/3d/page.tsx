import type { Metadata } from "next";
import { StudioShell } from "@/components/studio/studio-shell";

export const metadata: Metadata = {
  title: "3D Interactive Studio",
  description: "Explore Arvind's projects, skills, journey, and contact details inside an interactive 3D portfolio studio.",
  alternates: { canonical: "/3d" },
};

export default function StudioPage() {
  return <StudioShell />;
}
