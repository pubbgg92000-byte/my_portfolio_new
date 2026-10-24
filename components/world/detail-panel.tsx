import Image from "next/image";
import Link from "next/link";
import { experiments, projects } from "@/content/projects/projects";
import { profile, profileEmailUrl } from "@/content/profile";
import type { WorldPanel } from "./places";
import styles from "./world.module.css";

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
/** Loose match so "Next.js" finds "Next.js 14" and "Tailwind CSS" finds "Tailwind". */
const uses = (technologies: string[], skill: string) => {
  const target = normalise(skill);
  return technologies.some((tech) => {
    const value = normalise(tech);
    return value === target || (Math.min(value.length, target.length) >= 4 && (value.includes(target) || target.includes(value)));
  });
};

const openProject = (slug: string) => window.dispatchEvent(new CustomEvent<WorldPanel>("world:panel", { detail: { kind: "project", slug } }));

function ProjectChips({ slugs, empty }: { slugs: string[]; empty: string }) {
  if (!slugs.length) return <span className={styles.muted}>{empty}</span>;
  return (
    <span className={styles.chips}>
      {slugs.map((slug) => {
        const project = projects.find((p) => p.slug === slug);
        return project ? <button key={slug} type="button" onClick={() => openProject(slug)}>{project.title}</button> : null;
      })}
    </span>
  );
}

function ProjectCase({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  const doneList = [...(project.detail?.responsibilities ?? []), ...(project.contributions ?? [])];
  return (
    <article className={styles.detail}>
      {project.image ? <Image src={project.image.src} alt={project.image.alt} width={960} height={540} sizes="(max-width: 760px) 100vw, 860px" priority /> : null}
      <small>{project.category} · {project.year} · {project.status}{project.role ? ` · ${project.role}` : ""}</small>
      <h2>{project.title}</h2>
      <p className={styles.lead}>{project.summary}</p>
      {project.detail?.intro ? <><h3>Overview</h3><p>{project.detail.intro}</p></> : null}
      {doneList.length ? <><h3>What I did</h3><ul>{doneList.map((item) => <li key={item}>{item}</li>)}</ul></> : null}
      {project.detail?.outcome ? <><h3>Outcome</h3><p>{project.detail.outcome}</p></> : null}
      <h3>Built with</h3>
      <span className={styles.chips}>{project.technologies.map((t) => <i key={t}>{t}</i>)}</span>
      {project.gallery?.length ? (
        <>
          <h3>Screens</h3>
          <div className={styles.gallery}>
            {project.gallery.map((shot) => (
              <figure key={shot.src}>
                <Image src={shot.src} alt={shot.alt} width={480} height={300} sizes="(max-width: 760px) 50vw, 280px" />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </>
      ) : null}
      <div className={styles.detailLinks}>
        <Link href={`/projects/${project.slug}`}>Open full case study</Link>
        {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live site</a> : null}
        {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer">Source code</a> : null}
      </div>
    </article>
  );
}

function SkillGroup({ index }: { index: number }) {
  const group = profile.skillGroups[index];
  if (!group) return null;
  const rows = group.items.map((skill) => ({
    skill,
    projects: projects.filter((p) => uses(p.technologies, skill)).map((p) => p.slug),
    experiments: experiments.filter((e) => uses(e.technologies, skill)).map((e) => e.title),
  }));
  const proven = rows.filter((row) => row.projects.length || row.experiments.length).length;
  return (
    <article className={styles.detail}>
      <small>SKILLS GARDEN · {index + 1} of {profile.skillGroups.length}</small>
      <h2>{group.title}</h2>
      <p className={styles.lead}>{proven} of {group.items.length} skills in this group show up in my projects or experiments. Tap a project to open it.</p>
      <table className={styles.skillTable}>
        <thead><tr><th>Skill</th><th>Where it’s used</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.skill}>
              <th>{row.skill}</th>
              <td>
                <ProjectChips slugs={row.projects} empty="Not tagged on a listed project yet." />
                {row.experiments.length ? <span className={styles.muted}> Experiments: {row.experiments.join(", ")}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

function JourneyStep({ index }: { index: number }) {
  const step = profile.journey[index];
  if (!step) return null;
  const [from, to] = step.period.split(/[–-]/).map((part) => (/now/i.test(part) ? new Date().getFullYear() : Number(part)));
  const built = projects.filter((p) => { const year = Number(p.year.slice(0, 4)); return year >= from && year <= to; }).map((p) => p.slug);
  return (
    <article className={styles.detail}>
      <small>JOURNEY WALK · {step.period}</small>
      <h2>{step.title}</h2>
      <p className={styles.lead}>{step.detail}</p>
      <h3>Projects from this period</h3>
      <ProjectChips slugs={built} empty="No portfolio projects listed for this period." />
      {index === profile.journey.length - 1 ? (
        <>
          <h3>Certifications</h3>
          <span className={styles.chips}>{profile.certifications.map((c) => <i key={c}>{c}</i>)}</span>
        </>
      ) : null}
    </article>
  );
}

function Experiment({ slug }: { slug: string }) {
  const experiment = experiments.find((e) => e.slug === slug);
  if (!experiment) return null;
  return (
    <article className={styles.detail}>
      <small>EXPERIMENT · {experiment.category}</small>
      <h2>{experiment.title}</h2>
      <p className={styles.lead}>{experiment.summary}</p>
      <h3>Built with</h3>
      <span className={styles.chips}>{experiment.technologies.map((t) => <i key={t}>{t}</i>)}</span>
      <div className={styles.detailLinks}>
        <a href={experiment.githubUrl} target="_blank" rel="noreferrer">Source code</a>
        {experiment.liveUrl ? <a href={experiment.liveUrl} target="_blank" rel="noreferrer">Live demo</a> : null}
      </div>
    </article>
  );
}

function Contact() {
  return (
    <article className={styles.detail}>
      <small>CONTACT PIER</small>
      <h2>Let’s build something.</h2>
      <p className={styles.lead}>{profile.availability}. Based in {profile.location}.</p>
      <p>{profile.summary}</p>
      <div className={styles.detailLinks}>
        <a href={profileEmailUrl}>{profile.email}</a>
        <a href={profile.resumeUrl} download>Download résumé</a>
        <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </article>
  );
}

/** Detail sheet for anything clicked (or approached and opened with E) in the world. */
export function DetailPanel({ detail }: { detail: WorldPanel }) {
  switch (detail.kind) {
    case "project": return <ProjectCase slug={detail.slug} />;
    case "experiment": return <Experiment slug={detail.slug} />;
    case "skill": return <SkillGroup index={detail.index} />;
    case "journey": return <JourneyStep index={detail.index} />;
    case "contact": return <Contact />;
  }
}
