"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
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

export function FeaturedProjects() {
  const [openExperiment, setOpenExperiment] = useState<string | null>(null);

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
      <div className="project-list">
        {projects.map((project, index) => (
          <article
            id={`project-${project.slug}`}
            className="project-row"
            key={project.slug}
            style={{ "--project-stack-index": index + 1 } as CSSProperties}
          >
            <span className="project-number">0{index + 1}</span>
            <div className="project-main">
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <span>{project.summary}</span>
              {project.image ? (
                <figure className="project-media">
                  <img src={project.image.src} alt={project.image.alt} loading="lazy" />
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
                  <summary>Get login creds</summary>
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
              <div className="project-tags">{project.technologies.map((item) => <i key={item}>{item}</i>)}</div>
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
        <div className="experiment-grid">
          {experiments.map((experiment) => {
            const isOpen = openExperiment === experiment.slug;
            const Icon = experimentIcons[experiment.slug as keyof typeof experimentIcons] ?? Image;
            return (
              <article className={`experiment-card${isOpen ? " open" : ""}`} key={experiment.slug}>
                <button
                  className="experiment-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenExperiment(isOpen ? null : experiment.slug)}
                >
                  <span>
                    <p><Icon aria-hidden="true" />{experiment.category}</p>
                    <h4>{experiment.title}</h4>
                  </span>
                  <ChevronDown aria-hidden="true" />
                </button>
                <span>{experiment.summary}</span>
                <div className="project-tags">{experiment.technologies.map((item) => <i key={item}>{item}</i>)}</div>
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
