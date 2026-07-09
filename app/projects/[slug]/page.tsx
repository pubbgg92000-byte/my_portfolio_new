import { notFound } from "next/navigation";
import { Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import { PortfolioFooter } from "@/components/sections/portfolio-sections";
import { projects } from "@/content/projects/projects";
import { ProjectBackButton } from "./project-back-button";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return {};

  return {
    title: `${project.title} — Project Details`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  const gallery = project.gallery ?? (project.image ? [{ ...project.image, caption: "Project preview" }] : []);

  return (
    <main className="project-detail-page">
      <ProjectBackButton />

      <section className="project-detail-hero" aria-labelledby="project-detail-title">
        <div>
          <p>{project.category}</p>
          <h1 id="project-detail-title">{project.title}</h1>
          <span>{project.summary}</span>
          <div className="project-detail-meta">
            <strong>{project.role ?? project.status}</strong>
            <strong>{project.year}</strong>
            <strong>{project.status}</strong>
          </div>
          {project.liveUrl ? (
            <div className="project-detail-actions">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                View live website
                <ExternalLink aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </div>

        {project.image ? (
          <figure>
            <img src={project.image.src} alt={project.image.alt} />
          </figure>
        ) : (
          <aside className="project-detail-placeholder">
            <ImageIcon aria-hidden="true" />
            <span>Project visuals can be added here</span>
          </aside>
        )}
      </section>

      <section className="project-detail-body" aria-label={`${project.title} details`}>
        <div className="project-detail-copy">
          <p className="section-kicker">Overview</p>
          <h2>What this project shows</h2>
          <p>{project.detail?.intro ?? project.summary}</p>
        </div>

        <div className="project-detail-panel">
          <p className="section-kicker">Stack</p>
          <div className="project-tags">{project.technologies.map((item) => <i key={item}>{item}</i>)}</div>
        </div>

        {project.contributions ? (
          <div className="project-detail-panel">
            <p className="section-kicker">Contribution</p>
            <ul className="detail-list">
              {project.contributions.map((item) => (
                <li key={item}><Check aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.detail?.responsibilities ? (
          <div className="project-detail-panel">
            <p className="section-kicker">Responsibilities</p>
            <ul className="detail-list">
              {project.detail.responsibilities.map((item) => (
                <li key={item}><Check aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.detail?.outcome ? (
          <div className="project-detail-copy project-detail-outcome">
            <p className="section-kicker">Outcome</p>
            <h2>What I learned and delivered</h2>
            <p>{project.detail.outcome}</p>
          </div>
        ) : null}
      </section>

      {gallery.length ? (
        <section className="project-gallery" aria-labelledby="gallery-title">
          <header>
            <p className="section-kicker">Screens</p>
            <h2 id="gallery-title">Project visuals</h2>
          </header>
          <div>
            {gallery.map((image) => (
              <figure key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {project.demoCredentials?.length ? (
        <section className="project-demo-access" aria-labelledby="demo-access-title">
          <header>
            <p className="section-kicker">Demo access</p>
            <h2 id="demo-access-title">Try the Staffly portals</h2>
            <span>Use these demo accounts to explore the role-specific admin and employee experiences.</span>
          </header>
          <div>
            {project.demoCredentials.map((credential) => (
              <article key={credential.role}>
                <strong>{credential.role} portal</strong>
                <dl>
                  <div><dt>Email</dt><dd><code>{credential.email}</code></dd></div>
                  <div><dt>Password</dt><dd><code>{credential.password}</code></dd></div>
                </dl>
                <a href={credential.loginUrl} target="_blank" rel="noreferrer">
                  Open {credential.role} login
                  <ExternalLink aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <PortfolioFooter />
    </main>
  );
}
