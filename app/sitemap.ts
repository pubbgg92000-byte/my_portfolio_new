import type { MetadataRoute } from "next";
import { projects } from "@/content/projects/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arvind-dev.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/contact", "/resume", "/focus", "/certifications"];

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
