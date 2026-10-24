import { notFound } from "next/navigation";
import { ModelPreview } from "@/components/world/model-preview";

// Dev-only contact sheet of every world model.
export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ModelPreview />;
}
