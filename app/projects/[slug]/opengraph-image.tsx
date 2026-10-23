import { ImageResponse } from "next/og";
import { projects } from "@/content/projects/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project preview card";

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  const title = project?.title ?? "Project";
  const category = project?.category ?? "Portfolio";
  const stack = project?.technologies.slice(0, 5) ?? [];
  const year = project?.year ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px 56px 88px",
          background: "linear-gradient(135deg, #050505 0%, #0d0d0d 60%, #1a0d04 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: "#ff6a00", display: "flex" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 28, letterSpacing: 6, color: "#ff6a00", fontWeight: 700 }}>ARVIND •</span>
          <span style={{ fontSize: 22, letterSpacing: 3, color: "#9a9aa0" }}>{year}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 22, letterSpacing: 5, color: "#ff6a00", textTransform: "uppercase" }}>{category}</span>
          <span style={{ fontSize: title.length > 20 ? 78 : 100, fontWeight: 800, lineHeight: 1, letterSpacing: -3, maxWidth: 1000 }}>
            {title}
          </span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            {stack.map((item) => (
              <span
                key={item}
                style={{
                  padding: "10px 18px",
                  border: "1px solid rgba(255,255,255,0.24)",
                  borderRadius: 999,
                  fontSize: 22,
                  color: "#e8e8eb",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#9a9aa0", letterSpacing: 2 }}>
          <span>arvind-dev.in</span>
          <span>Frontend Developer · AI Automation</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
