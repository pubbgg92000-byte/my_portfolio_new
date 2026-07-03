import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/content/projects/projects";

export function FeaturedProjects() {
  return (
    <section id="projects" className="featured-projects" aria-labelledby="projects-title">
      <header className="section-heading">
        <div><p>Selected work / 2026</p><h2 id="projects-title">Featured projects</h2></div>
        <p>Product interfaces, creative web experiences, and business-facing systems—built as self-initiated, AI-assisted portfolio case studies.</p>
      </header>
      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-row" key={project.slug}>
            <span className="project-number">0{index + 1}</span>
            <div className="project-main">
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <span>{project.summary}</span>
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
              <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}><Github /></a>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live website`}><ArrowUpRight /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
