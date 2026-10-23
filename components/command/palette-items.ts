import { experiments, projects } from "@/content/projects/projects";
import { profile, profileEmailUrl } from "@/content/profile";

export type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigate" | "Projects" | "Experiments" | "Actions";
  href?: string;
  external?: boolean;
  action?: "copy-email";
  keywords?: string;
};

/** Built on the server so the client bundle never ships the full project content. */
export function buildPaletteItems(): PaletteItem[] {
  const navigate: PaletteItem[] = [
    { id: "nav-home", label: "Home", hint: "Top of the site", group: "Navigate", href: "/#home" },
    { id: "nav-3d", label: "3D Interactive Studio", hint: "Enter the portfolio park", group: "Navigate", href: "/3d", keywords: "three gsap spatial immersive" },
    { id: "nav-projects", label: "Projects", hint: "Featured work", group: "Navigate", href: "/#projects" },
    { id: "nav-about", label: "About", hint: "Who I am", group: "Navigate", href: "/#about" },
    { id: "nav-skills", label: "Skills", hint: "Tools I use", group: "Navigate", href: "/#skills" },
    { id: "nav-github", label: "GitHub activity", hint: "Recent repos", group: "Navigate", href: "/#github" },
    { id: "nav-journey", label: "Journey", hint: "Career timeline", group: "Navigate", href: "/journey", keywords: "experience timeline evolution" },
    { id: "nav-resume", label: "Resume", hint: "Preview and download", group: "Navigate", href: "/resume", keywords: "cv" },
    { id: "nav-certifications", label: "Certifications", hint: "Courses and training", group: "Navigate", href: "/certifications" },
    { id: "nav-focus", label: "Current focus", hint: "What I'm learning", group: "Navigate", href: "/focus" },
    { id: "nav-contact", label: "Contact", hint: "Send a message", group: "Navigate", href: "/contact", keywords: "email hire" },
  ];

  const projectItems: PaletteItem[] = projects.map((project) => ({
    id: `project-${project.slug}`,
    label: project.title,
    hint: project.category,
    group: "Projects",
    href: `/projects/${project.slug}`,
    keywords: project.technologies.join(" "),
  }));

  const experimentItems: PaletteItem[] = experiments.map((experiment) => ({
    id: `experiment-${experiment.slug}`,
    label: experiment.title,
    hint: experiment.liveUrl ? "Live site" : "Source on GitHub",
    group: "Experiments",
    href: experiment.liveUrl ?? experiment.githubUrl,
    external: true,
    keywords: `${experiment.category} ${experiment.technologies.join(" ")}`,
  }));

  const actions: PaletteItem[] = [
    { id: "act-resume", label: "Download resume PDF", group: "Actions", href: profile.resumeUrl, external: true, keywords: "cv download" },
    { id: "act-copy-email", label: "Copy email address", hint: profile.email, group: "Actions", action: "copy-email" },
    { id: "act-email", label: "Send an email", group: "Actions", href: profileEmailUrl, external: true },
    { id: "act-github", label: "Open GitHub profile", group: "Actions", href: profile.socials.github, external: true },
    { id: "act-linkedin", label: "Open LinkedIn", group: "Actions", href: profile.socials.linkedin, external: true },
  ];

  return [...navigate, ...projectItems, ...experimentItems, ...actions];
}
