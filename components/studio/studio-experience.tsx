"use client";
/* eslint-disable @next/next/no-img-element -- DOM images are also rendered inside Drei Html transforms. */

import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CityRoad } from "./city-road";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  Map,
  Menu,
  Play,
  Pause,
  Network,
  RotateCcw,
  Sparkles as SparklesIcon,
  UserRound,
  X,
} from "lucide-react";
import { experiments, projects, type Experiment, type Project } from "@/content/projects/projects";
import { profile, profileEmailUrl } from "@/content/profile";
import styles from "./studio.module.css";

type Zone = "identity" | "projects" | "archive" | "skills" | "journey" | "contact";
type StudioWork = (Project | Experiment) & { kind: "project" | "experiment" };

const zoneInfo: Record<Zone, { label: string; eyebrow: string; title: string; description: string }> = {
  identity: { label: "Identity", eyebrow: "Studio 00 / Arrival", title: "Frontend craft meets intelligent systems.", description: profile.summary },
  projects: { label: "Projects", eyebrow: "Studio 01 / Selected work", title: "Six builds with their own signal.", description: "Move through the project exhibits and open any station for the real screenshots, contribution details, source, and live product." },
  archive: { label: "Archive", eyebrow: "Studio 02 / Complete index", title: "Every build, one searchable wall.", description: "The full collection of professional work, product experiments, automation tools, and visual prototypes." },
  skills: { label: "Skills", eyebrow: "Studio 03 / Systems bench", title: "Tools arranged by what they help me ship.", description: "A practical stack spanning interfaces, APIs, AI workflows, automation, testing, and deployment." },
  journey: { label: "Journey", eyebrow: "Studio 04 / Evolution corridor", title: "Mechanical. Business. Frontend. Automation.", description: "A career path shaped by engineering discipline, operating experience, and a steady move toward product systems." },
  contact: { label: "Contact", eyebrow: "Studio 05 / Open channel", title: "Let’s build something useful and memorable.", description: profile.availability },
};

const featuredWorks: StudioWork[] = [
  ...projects.filter((item) => item.studio?.featured).map((item) => ({ ...item, kind: "project" as const })),
  ...experiments.filter((item) => item.studio?.featured).map((item) => ({ ...item, kind: "experiment" as const })),
].sort((a, b) => (a.studio?.order ?? 99) - (b.studio?.order ?? 99));

const allWorks: StudioWork[] = [
  ...projects.map((item) => ({ ...item, kind: "project" as const })),
  ...experiments.map((item) => ({ ...item, kind: "experiment" as const })),
];

function CityLoading() {
  const { progress } = useProgress();
  return <Html center><div role="status" className={styles.cityLoading}>Loading city · {Math.round(progress)}%</div></Html>;
}

function ProjectDetail({ work, onClose }: { work: StudioWork; onClose: () => void }) {
  const project = work.kind === "project" ? work as Project : null;
  const image = project?.image;
  return (
    <aside className={styles.detailPanel} aria-label={`${work.title} details`}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close project details"><X /></button>
      {image ? <img src={image.src} alt={image.alt} /> : <div className={styles.detailSignal}><span>{work.title.slice(0, 2).toUpperCase()}</span></div>}
      <p className={styles.eyebrow}>{work.category}</p>
      <h2>{work.title}</h2>
      <p>{work.summary}</p>
      {project?.role ? <p className={styles.role}><strong>Role</strong>{project.role}</p> : null}
      {project?.contributions?.length ? <ul>{project.contributions.map((item) => <li key={item}>{item}</li>)}</ul> : null}
      <div className={styles.tags}>{work.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
      {project?.demoCredentials ? (
        <details className={styles.credentials}>
          <summary>Demo credentials</summary>
          {project.demoCredentials.map((credential) => <div key={credential.role}><strong>{credential.role}</strong><code>{credential.email}</code><code>{credential.password}</code></div>)}
        </details>
      ) : null}
      <div className={styles.detailActions}>
        {work.liveUrl ? <a href={work.liveUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight /></a> : null}
        {work.githubUrl ? <a href={work.githubUrl} target="_blank" rel="noreferrer">Source <Github /></a> : null}
        {work.kind === "project" ? <Link href={`/projects/${work.slug}`}>Full case study <ArrowUpRight /></Link> : null}
      </div>
    </aside>
  );
}

function ZoneContent({ zone, onSelect }: { zone: Zone; onSelect: (work: StudioWork) => void }) {
  if (zone === "identity") return (
    <div className={styles.identityCard}>
      <img src={profile.portraitUrl} alt={`Portrait of ${profile.shortName}`} />
      <div><span>Available / Hyderabad</span><h2>{profile.name}</h2><p>{profile.role}</p><div className={styles.identityLinks}><a href={profile.socials.github} target="_blank" rel="noreferrer"><Github /> GitHub</a><a href={profile.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a></div></div>
    </div>
  );
  if (zone === "projects") return (
    <div className={styles.featuredStrip}>{featuredWorks.map((work, index) => <button type="button" onClick={() => onSelect(work)} key={work.slug}><span>0{index + 1}</span><strong>{work.title}</strong><small>{work.technologies.slice(0, 2).join(" / ")}</small></button>)}</div>
  );
  if (zone === "archive") return (
    <div className={styles.archiveGrid}>{allWorks.map((work) => <button type="button" key={work.slug} onClick={() => onSelect(work)}><span>{work.kind === "project" ? "Case study" : "Experiment"}</span><strong>{work.title}</strong><small>{work.technologies.slice(0, 3).join(" · ")}</small><ArrowUpRight /></button>)}</div>
  );
  if (zone === "skills") return (
    <div className={styles.skillGrid}>{profile.skillGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.items.map((item) => <span key={item}>{item}</span>)}</div></section>)}</div>
  );
  if (zone === "journey") return (
    <div className={styles.journeyList}>{profile.journey.map((item, index) => <article key={item.period}><span>0{index + 1}</span><div><small>{item.period}</small><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}</div>
  );
  return (
    <div className={styles.contactGrid}>
      <a href={profileEmailUrl}><Mail /><span>Email</span><strong>{profile.email}</strong></a>
      <a href={profile.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin /><span>Connect</span><strong>LinkedIn</strong></a>
      <a href={profile.socials.github} target="_blank" rel="noreferrer"><Github /><span>Code</span><strong>GitHub</strong></a>
      <a href={profile.resumeUrl} download><Download /><span>Profile</span><strong>Download résumé</strong></a>
    </div>
  );
}

const zoneIcons = { identity: UserRound, projects: BriefcaseBusiness, archive: Map, skills: Code2, journey: Network, contact: Mail };

export function InteractiveStudio({ forceFallback = false }: { forceFallback?: boolean }) {
  const [zone, setZone] = useState<Zone>("identity");
  const [selectedWork, setSelectedWork] = useState<StudioWork | null>(null);
  const [entered, setEntered] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [canvasFailed, setCanvasFailed] = useState(forceFallback);
  useEffect(() => { if (forceFallback) setCanvasFailed(true); }, [forceFallback]);
  const zones = Object.keys(zoneInfo) as Zone[];
  const currentIndex = zones.indexOf(zone);
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);


  useGSAP(() => {
    if (!entered || !contentRef.current) return;
    gsap.fromTo(contentRef.current.children, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: "power3.out" });
  }, { dependencies: [zone, entered], scope: rootRef });

  useGSAP(() => {
    if (!selectedWork) return;
    gsap.fromTo(`.${styles.detailPanel}`, { xPercent: 100 }, { xPercent: 0, duration: .72, ease: "power4.out" });
  }, { dependencies: [selectedWork], scope: rootRef });

  const move = useCallback((delta: number) => {
    setSelectedWork(null);
    setPanelOpen(false);
    setPlaying(false);
    setZone(zones[(currentIndex + delta + zones.length) % zones.length]);
  }, [currentIndex, zones]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.closest("input, textarea, select, button, a")) return;
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Escape") { setSelectedWork(null); setMenuOpen(false); setPanelOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [move]);

  const selectZone = (next: Zone) => { setZone(next); setSelectedWork(null); setMenuOpen(false); setEntered(true); setPlaying(false); setPanelOpen(next !== "identity"); };
  const current = zoneInfo[zone];

  return (
    <main ref={rootRef} className={`${styles.studio} ${entered ? styles.entered : ""}`}>
      <a className={styles.skipLink} href="#studio-content">Skip 3D scene</a>
      {!canvasFailed ? (
        <div className={styles.canvas}>
          <Canvas dpr={[1, 1.65]} camera={{ position: [0, 3.8, 18], fov: 65, far: 300 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", () => setCanvasFailed(true), { once: true })}>
            <Suspense fallback={<CityLoading />}><CityRoad district={currentIndex} playing={playing && !selectedWork && !panelOpen} onProject={(slug) => { setSelectedWork(allWorks.find((work) => work.slug === slug) ?? null); setPlaying(false); }} /></Suspense>
          </Canvas>
        </div>
      ) : <div className={styles.fallbackBackdrop}><span>3D fallback mode</span></div>}

      <header className={styles.header}>
        <button type="button" className={styles.menuToggle} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}<span>Explore</span></button>
        <Link href="/" className={styles.brand}>ARVIND<span>•</span><small>PORTFOLIO CITY</small></Link>
        <Link href="/" className={styles.classicLink}><ArrowLeft /> Classic portfolio</Link>
      </header>

      <nav className={`${styles.zoneNav} ${menuOpen ? styles.open : ""}`} aria-label="3D studio sections">
        {zones.map((item, index) => { const Icon = zoneIcons[item]; return <button type="button" key={item} aria-current={zone === item ? "page" : undefined} onClick={() => selectZone(item)}><span>0{index}</span><Icon /><strong>{zoneInfo[item].label}</strong></button>; })}
      </nav>

      {!panelOpen && !canvasFailed && !selectedWork ? (
        <section className={styles.cityWelcome} aria-label="City tour">
          <p>ARVIND / PORTFOLIO CITY</p>
          <h1>Work around every corner.</h1>
          <span>Explore the avenue. Select a project billboard, or choose a district.</span>
          <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}{playing ? "Pause tour" : "Start road tour"}</button>
          <button type="button" onClick={() => { setZone("archive"); setPanelOpen(true); setPlaying(false); }}>Browse all work</button>
        </section>
      ) : null}
      {panelOpen || canvasFailed ? (
        <section ref={contentRef} className={`${styles.content} ${styles.cityPanel}`} id="studio-content" tabIndex={-1}>
          {!canvasFailed ? <button className={styles.closeButton} onClick={() => setPanelOpen(false)} aria-label="Return to city"><X /></button> : null}
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{current.label} / CITY DIRECTORY</p>
            <h1>{current.title}</h1>
            <p>{current.description}</p>
          </div>
          <ZoneContent zone={zone} onSelect={setSelectedWork} />
        </section>
      ) : <a className={styles.skipLink} id="studio-content" href="?fallback=1">Open accessible portfolio directory</a>}

      {selectedWork ? <ProjectDetail work={selectedWork} onClose={() => setSelectedWork(null)} /> : null}

      <footer className={styles.controls}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous studio section"><ChevronLeft /></button>
        <span><i style={{ width: `${((currentIndex + 1) / zones.length) * 100}%` }} />{currentIndex + 1} / {zones.length}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next studio section"><ChevronRight /></button>
        <button type="button" onClick={() => selectZone("identity")} aria-label="Return to identity"><RotateCcw /></button>
      </footer>
      <div className={styles.status}><SparklesIcon /><span>{canvasFailed ? "Accessible fallback" : "Realtime scene"}</span><i />{profile.location}</div>
    </main>
  );
}
