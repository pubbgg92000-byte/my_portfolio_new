"use client";

import { useState, type CSSProperties } from "react";
import Link, { useLinkStatus } from "next/link";
import {
  ArrowUpRight,
  Loader2,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  Dumbbell,
  Github,
  Image,
  Leaf,
  MailCheck,
  PawPrint,
} from "lucide-react";
import { experiments, projects } from "@/content/projects/projects";
import { responsiveImage } from "@/lib/responsive-image";

const experimentIcons = {
  "forest-life": Leaf,
  "titan-temp-mail": MailCheck,
  "3d-animal-world": PawPrint,
  "auto-job-search-apply": BriefcaseBusiness,
  "iopaint-bulk": Image,
  "desktop-organizer": Bot,
  "shoot-asset": Image,
  "fit-ai-pro": Dumbbell,
} as const;

const techIcons: Record<string, string> = {
  "next.js": "N",
  react: "⚛",
  "react 19": "⚛",
  typescript: "TS",
  javascript: "JS",
  dart: "D",
  flutter: "F",
  sveltekit: "S",
  "tailwind css": "TW",
  gsap: "G",
  "framer motion": "FM",
  lenis: "L",
  nestjs: "NJS",
  postgresql: "PG",
  prisma: "P",
  sqlite: "SQL",
  supabase: "SB",
  python: "PY",
  docker: "D",
  playwright: "PW",
  "three.js": "3D",
  r3f: "R3F",
  vite: "V",
  storybook: "SB",
  eleventy: "11",
  html: "H",
  "rest apis": "API",
  "api integration": "API",
  "provider apis": "API",
  "telegram bot": "TG",
  "hugging face": "HF",
  automation: "⚙",
  pdf: "PDF",
  cli: ">_",
};

function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className="spin link-pending" aria-hidden="true" /> : null;
}

type FilterKey = "all" | "professional" | "personal" | "svelte" | "react" | "automation";

const filters: { key: FilterKey; label: string; match: (technologies: string[], category: string) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "professional", label: "Professional", match: (_, category) => /professional/i.test(category) },
  { key: "personal", label: "Personal builds", match: (_, category) => !/professional/i.test(category) },
  { key: "svelte", label: "Svelte", match: (technologies) => technologies.some((item) => /svelte/i.test(item)) },
  { key: "react", label: "React / Next.js", match: (technologies) => technologies.some((item) => /react|next|r3f/i.test(item)) },
  {
    key: "automation",
    label: "Automation & AI",
    match: (technologies, category) =>
      technologies.some((item) => /automation|playwright|selenium|python|n8n|hugging face|telegram|^cli$/i.test(item)) ||
      /automation|\bai\b|job-search|tooling/i.test(category),
  },
];

function techSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function TechTag({ name }: { name: string }) {
  const normalized = name.toLowerCase();
  const label = techIcons[normalized] ?? name.slice(0, 2).toUpperCase();

  return (
    <i>
      <span className={`tech-chip-icon tech-${techSlug(name)}`} aria-hidden="true">{label}</span>
      {name}
    </i>
  );
}

export function FeaturedProjects() {
  const [openExperiment, setOpenExperiment] = useState<string | null>(null);
  const [filterKey, setFilterKey] = useState<FilterKey>("all");
  const activeFilter = filters.find((filter) => filter.key === filterKey) ?? filters[0];
  const visibleProjects = projects.filter((project) => activeFilter.match(project.technologies, project.category));
  const visibleExperiments = experiments.filter((experiment) => activeFilter.match(experiment.technologies, experiment.category));
  const countFor = (filter: (typeof filters)[number]) =>
    projects.filter((p) => filter.match(p.technologies, p.category)).length +
    experiments.filter((e) => filter.match(e.technologies, e.category)).length;

  const rememberProjectPosition = (projectSlug: string) => {
    window.sessionStorage.setItem(
      "portfolioProjectReturn",
      JSON.stringify({
        projectSlug,
        returnHash: `#project-${projectSlug}`,
        savedAt: Date.now(),
      }),
    );
  };

  return (
    <section id="projects" className="featured-projects" aria-labelledby="projects-title">
      <header className="section-heading">
        <div><p>Selected work</p><h2 id="projects-title">Featured projects</h2></div>
        <p>Professional contributions, product interfaces, creative web experiences, and business-facing systems built across team projects and self-initiated portfolio work.</p>
      </header>
      <div className="project-filters" role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            aria-pressed={filter.key === filterKey}
            onClick={() => setFilterKey(filter.key)}
          >
            {filter.label}
            <span aria-hidden="true">{countFor(filter)}</span>
          </button>
        ))}
        <p className="sr-only" role="status" aria-live="polite">
          Showing {visibleProjects.length} featured projects and {visibleExperiments.length} experiments.
        </p>
      </div>
      {visibleProjects.length === 0 ? (
        <p className="filter-empty">No featured projects use this filter yet. The experiments below might.</p>
      ) : null}
      <div className="project-list">
        {visibleProjects.map((project, index) => (
          <article
            id={`project-${project.slug}`}
            className="project-row"
            key={project.slug}
            style={{ "--project-stack-index": index + 1 } as CSSProperties}
          >
            <span className="project-number">0{index + 1}</span>
            <div className="project-main">
              <p>{project.category}</p>
              <h3>
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={() => rememberProjectPosition(project.slug)}
                  className="project-title-link"
                >
                  {project.title}
                  <LinkPending />
                </Link>
              </h3>
              <span>{project.summary}</span>
              {project.image ? (
                <figure className="project-media">
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`View ${project.title} project details`}
                    onClick={() => rememberProjectPosition(project.slug)}
                    tabIndex={-1}
                  >
                    <img {...responsiveImage(project.image.src)} sizes="(max-width: 780px) 100vw, 620px" alt={project.image.alt} loading="lazy" decoding="async" />
                  </Link>
                </figure>
              ) : null}
              {project.contributions ? (
                <div className="project-proof" aria-label={`${project.title} contribution highlights`}>
                  <strong>Contribution</strong>
                  <ul>
                    {project.contributions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ) : null}
              {project.demoCredentials ? (
                <details className="project-credentials">
                  <summary>Demo login details</summary>
                  <div>
                    {project.demoCredentials.map((credential) => (
                      <section key={credential.role}>
                        <strong>{credential.role}</strong>
                        <p><span>Email</span><code>{credential.email}</code></p>
                        <p><span>Password</span><code>{credential.password}</code></p>
                        <a href={credential.loginUrl} target="_blank" rel="noreferrer">Open {credential.role} portal <ArrowUpRight /></a>
                      </section>
                    ))}
                  </div>
                </details>
              ) : null}
              <div className="project-tags">{project.technologies.map((item) => <TechTag key={item} name={item} />)}</div>
            </div>
            <div className="project-meta"><span>{project.status}</span><strong>{project.year}</strong></div>
            <div className="project-links">
              <Link
                href={`/projects/${project.slug}`}
                aria-label={`${project.title} project details`}
                onClick={() => rememberProjectPosition(project.slug)}
              >
                <ArrowUpRight />
              </Link>
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><Github /></a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <div className="experiment-section">
        <header>
          <p>Selected experiments</p>
          <h3>Smaller builds, utilities, and creative prototypes</h3>
        </header>
        {visibleExperiments.length === 0 ? (
          <p className="filter-empty">No experiments match this filter.</p>
        ) : null}
        <div className="experiment-grid">
          {visibleExperiments.map((experiment) => {
            const isOpen = openExperiment === experiment.slug;
            const Icon = experimentIcons[experiment.slug as keyof typeof experimentIcons] ?? Image;
            const cardId = `experiment-${experiment.slug}`;
            return (
              <article className={`experiment-card${isOpen ? " open" : ""}`} key={experiment.slug} id={cardId}>
                <button
                  className="experiment-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={cardId}
                  onClick={() => setOpenExperiment(isOpen ? null : experiment.slug)}
                >
                  <span>
                    <p><Icon aria-hidden="true" />{experiment.category}</p>
                    <h4>{experiment.title}</h4>
                  </span>
                  <ChevronDown aria-hidden="true" />
                </button>
                <span>{experiment.summary}</span>
                <div className="project-tags">{experiment.technologies.map((item) => <TechTag key={item} name={item} />)}</div>
                <div className="experiment-links">
                  <a href={experiment.githubUrl} target="_blank" rel="noreferrer" aria-label={`${experiment.title} source code`}><Github /></a>
                  {experiment.liveUrl ? (
                    <a href={experiment.liveUrl} target="_blank" rel="noreferrer" aria-label={`${experiment.title} live website`}><ArrowUpRight /></a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
