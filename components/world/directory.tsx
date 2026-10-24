import Image from "next/image";
import Link from "next/link";
import { experiments, projects } from "@/content/projects/projects";
import { profile, profileEmailUrl } from "@/content/profile";
import styles from "./world.module.css";

const ordered = [...projects].sort((a, b) => (a.studio?.order ?? 99) - (b.studio?.order ?? 99));

/** Plain HTML version of the whole portfolio: no-WebGL fallback and in-world "Directory" panel. */
export function Directory({ standalone = false }: { standalone?: boolean }) {
  return (
    <div className={standalone ? styles.directoryPage : styles.directory}>
      {standalone ? (
        <header className={styles.directoryTop}>
          <span className={styles.brand}>ARVIND M <small>PORTFOLIO WORLD</small></span>
          <Link href="/">Classic portfolio ↗</Link>
        </header>
      ) : null}
      <section className={styles.dirHero}>
        <p>{profile.role} · {profile.location}</p>
        <h1>Building interfaces<br />with intelligence.</h1>
        <span>{profile.summary}</span>
        <div className={styles.dirActions}>
          <a href="#work">Explore my work</a>
          <a href={profile.resumeUrl} download>Download résumé</a>
        </div>
      </section>

      <section id="work" className={styles.dirSection}>
        <h2>Selected work</h2>
        <ul className={styles.dirGrid}>
          {ordered.map((project) => (
            <li key={project.slug}>
              {project.image ? <Image src={project.image.src} alt={project.image.alt} width={640} height={360} sizes="(max-width: 760px) 100vw, 320px" /> : null}
              <small>{project.category} · {project.year}</small>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <Link href={`/projects/${project.slug}`}>View case study →</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.dirSection}>
        <h2>Experiments</h2>
        <ul className={styles.dirList}>
          {experiments.map((experiment) => (
            <li key={experiment.slug}>
              <strong>{experiment.title}</strong> — {experiment.summary}{" "}
              <a href={experiment.githubUrl} target="_blank" rel="noreferrer">Source</a>
              {experiment.liveUrl ? <> · <a href={experiment.liveUrl} target="_blank" rel="noreferrer">Live</a></> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.dirSection}>
        <h2>Tools arranged by what they help me ship.</h2>
        <div className={styles.dirSkills}>
          {profile.skillGroups.map((group) => (
            <div key={group.title}><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></div>
          ))}
        </div>
      </section>

      <section className={styles.dirSection}>
        <h2>Journey</h2>
        <ol className={styles.dirTimeline}>
          {profile.journey.map((step) => (
            <li key={step.period}><small>{step.period}</small><strong>{step.title}</strong><p>{step.detail}</p></li>
          ))}
        </ol>
      </section>

      <section className={styles.dirSection}>
        <h2>Let’s build something.</h2>
        <p>{profile.availability}</p>
        <div className={styles.dirActions}>
          <a href={profileEmailUrl}>{profile.email}</a>
          <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </section>
    </div>
  );
}
