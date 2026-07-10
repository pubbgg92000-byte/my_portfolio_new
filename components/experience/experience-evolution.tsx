"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Bot,
  Braces,
  Check,
  Code2,
  Cpu,
  GraduationCap,
  Layers3,
  PanelsTopLeft,
  Server,
  Sparkles,
  Store,
  Wrench,
} from "lucide-react";
import { experiments, projects } from "@/content/projects/projects";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "2017",
    arc: "Mechanical Engineer",
    scale: "small",
    title: "Mechanical Engineering",
    place: "Holy Mary Group of Institutions",
    type: "Mechanical Engineering Diploma",
    body: "2017",
    skillsTitle: "Core strengths",
    skills: ["Engineering Fundamentals", "Analytical Thinking", "Problem Solving"],
    icon: Wrench,
  },
  {
    year: "2017-2021",
    arc: "Mechanical Engineer",
    scale: "small",
    title: "Bachelor of Technology",
    place: "St. Mary's Group of Institutions",
    type: "Mechanical Engineering",
    body: "2017-2021",
    skillsTitle: "Core strengths",
    skills: ["Engineering Discipline", "Systems Thinking", "Project Execution"],
    icon: GraduationCap,
  },
  {
    year: "2020-2023",
    arc: "Business",
    scale: "medium",
    title: "Business Experience",
    place: "Local Grocery Operations",
    type: "Customer-facing operations",
    body: "Real business exposure: pricing, stock decisions, customer conversations, supplier coordination, and daily ownership.",
    skillsTitle: "Transferable skills",
    skills: ["Customer Management", "Pricing", "Inventory", "Operations", "Communication"],
    icon: Store,
  },
  {
    year: "Early 2024",
    arc: "Frontend",
    scale: "large",
    title: "Entering Software Development",
    place: "Independent learning",
    type: "First websites and frontend foundations",
    body: "Started learning programming independently, moving from HTML and CSS into JavaScript, Svelte, and Git. Built my first websites and discovered a serious pull toward frontend engineering.",
    skills: ["HTML", "CSS", "JavaScript", "Svelte", "Git"],
    icon: Code2,
  },
  {
    year: "2024-2025",
    arc: "Frontend",
    scale: "xlarge",
    title: "Frontend Developer",
    place: "Startup Environment",
    type: "Built SaaS interfaces",
    body: "Worked on practical product screens in a fast-moving environment, turning subscription and admin workflows into responsive interfaces.",
    skillsTitle: "Built with",
    skills: ["Svelte", "Tailwind", "JavaScript", "Git"],
    projects: ["Responsive UI", "Reusable Components", "Meal Subscription Platform", "Admin Dashboard"],
    achievement: "Contributed reusable frontend components and workflow screens for SaaS-style products.",
    icon: Layers3,
  },
  {
    year: "2025",
    arc: "Automation",
    scale: "xlarge",
    title: "Ai Automation-Supported Systems",
    place: "Independent experiments",
    type: "Automation-supported engineering",
    body: "Began using AI tools as support for development, focusing on prompt engineering, automation workflows, agent basics, and practical productivity patterns.",
    skills: ["Prompt Engineering", "Automation Workflows", "Agent Basics", "AI Tooling"],
    icon: Cpu,
  },
  {
    year: "2026",
    arc: "Current position",
    scale: "hero",
    title: "Freelance Frontend Developer & Ai Automation Engineer",
    place: "Current focus",
    type: "Frontend, SaaS products, Ai Automation, Agentic Workflows",
    body: "Building frontend interfaces, automation-supported systems, SaaS products, developer tools, and interactive portfolios with a stack centered on Next.js, React, Node.js, GSAP, Three.js, Prisma, and Docker.",
    skills: ["Frontend Interfaces", "Agentic Automation Systems", "SaaS Products", "Developer Tools", "Interactive Portfolios"],
    current: true,
    icon: Bot,
  },
] as const;

const learningMarquee = [
  { label: "HTML", badge: "</>" },
  { label: "CSS", badge: "#" },
  { label: "JavaScript", icon: Braces },
  { label: "Svelte", badge: "S" },
  { label: "React", icon: Sparkles },
  { label: "Next.js", icon: PanelsTopLeft },
  { label: "Node.js", icon: Server },
  { label: "AI", icon: Code2 },
  { label: "Automation", icon: Cpu },
  { label: "GSAP", badge: "G" },
];
const milestones = [
  "HTML & CSS Foundations",
  "SvelteKit Client Projects",
  "Professional Frontend Role",
  "Staffly HRMS Product",
  "AI Automation Systems",
  "Interactive Portfolio",
];
const certifications = [
  { label: "Generative AI", badge: "AI" },
  { label: "AI Workflow", badge: "WF" },
  { label: "n8n", badge: "N8" },
  { label: "Prompt Engineering", badge: "PE" },
  { label: "Frontend", badge: "</>" },
  { label: "Selenium", badge: "SE" },
];
const building = ["AI Agents", "Staffly HRMS", "Interactive Portfolio", "Automation Workflows"];

function normalizeTech(value: string) {
  if (/next/i.test(value)) return "Next.js";
  if (/react|r3f/i.test(value)) return "React";
  if (/three/i.test(value)) return "Three.js";
  if (/node|nestjs/i.test(value)) return "Node.js";
  if (/prisma/i.test(value)) return "Prisma";
  if (/docker/i.test(value)) return "Docker";
  if (/gsap/i.test(value)) return "GSAP";
  if (/automation|playwright|launchd/i.test(value)) return "Automation";
  if (/ai|llm|inpainting|hugging face/i.test(value)) return "AI";
  return value.replace("React 19", "React");
}

export function ExperienceEvolution() {
  const rootRef = useRef<HTMLElement>(null);
  const autoStack = useMemo(() => {
    const source = [...projects, ...experiments].flatMap((item) => [
      ...item.technologies,
      item.category,
      item.summary,
    ]);
    const preferred = ["React", "Next.js", "Node.js", "Prisma", "Docker", "GSAP", "Three.js", "AI", "Automation"];
    const discovered = new Set(source.map(normalizeTech));
    return preferred.filter((item) => discovered.has(item));
  }, []);

  useEffect(() => {
    const scope = rootRef.current;
    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const compactTimeline = window.matchMedia("(max-width: 860px)").matches;

      gsap.fromTo(
        [".evolution-hero>p", ".evolution-hero>h2", ".evolution-hero>span"],
        { opacity: 0, y: compactTimeline ? 24 : 38 },
        {
          opacity: 1,
          y: 0,
          duration: .8,
          stagger: .12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".evolution-hero",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(".evolution-map strong", {
        opacity: 0,
        y: compactTimeline ? 18 : 28,
        scale: .94,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: .55,
        stagger: .11,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".evolution-map",
          start: "top 88%",
          once: true,
        },
      });

      gsap.fromTo(".evolution-line-fill", { scaleY: 0 }, {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".evolution-timeline",
          start: "top 72%",
          end: "bottom 68%",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".evolution-node").forEach((node, index) => {
        gsap.fromTo(node, {
          opacity: 0,
          x: compactTimeline ? 0 : index % 2 === 0 ? -48 : 48,
          y: 28,
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: .85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 82%",
            once: true,
          },
        });

        ScrollTrigger.create({
          trigger: node,
          start: "top 58%",
          end: "bottom 46%",
          toggleClass: { targets: node, className: "active-node" },
          onEnter: () => {
            gsap.utils.toArray<HTMLElement>(".evolution-node").forEach((item, itemIndex) => {
              item.classList.toggle("past-node", itemIndex < index);
              item.classList.toggle("waiting-node", itemIndex > index);
            });
          },
          onEnterBack: () => {
            gsap.utils.toArray<HTMLElement>(".evolution-node").forEach((item, itemIndex) => {
              item.classList.toggle("past-node", itemIndex < index);
              item.classList.toggle("waiting-node", itemIndex > index);
            });
          },
        });
      });

      gsap.fromTo(".learning-step", { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: .55,
        stagger: .08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".learning-track",
          start: "top 80%",
          once: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(
        ".learning-panel, .milestone-panel, .certification-panel, .currently-building, .auto-tech-panel",
      ).forEach((panel, index) => {
        gsap.fromTo(panel, {
          opacity: 0,
          y: compactTimeline ? 34 : 52,
          scale: compactTimeline ? .99 : .975,
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: compactTimeline ? .65 : .85,
          delay: index % 2 === 1 ? .08 : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: compactTimeline ? "top 90%" : "top 84%",
            once: true,
          },
        });

        const items = panel.querySelectorAll<HTMLElement>(
          ".milestone-panel span, .certification-panel span, .currently-building span, .currently-building aside strong, .auto-tech-panel span",
        );
        if (!items.length) return;

        gsap.fromTo(items, { opacity: 0, y: 14 }, {
          opacity: 1,
          y: 0,
          duration: .45,
          stagger: .055,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: compactTimeline ? "top 86%" : "top 78%",
            once: true,
          },
        });
      });
    }, scope);

    return () => context.revert();
  }, []);

  return (
    <section id="experience" ref={rootRef} className="experience-evolution" aria-labelledby="experience-title">
      <header className="evolution-hero">
        <p>The evolution</p>
        <h2 id="experience-title">THE EVOLUTION</h2>
        <span>Every project, every challenge, every step shaped the engineer I am today.</span>
        <div className="evolution-map" aria-label="Growth path">
          {["2017", "Mechanical Engineering", "Business", "Frontend Developer", "Applied AI", "Today"].map((item) => (
            <strong key={item}>{item}</strong>
          ))}
        </div>
      </header>

      <div className="evolution-timeline">
        <div className="evolution-line" aria-hidden="true"><span className="evolution-line-fill" /></div>
        {timeline.map((item, index) => {
          const Icon = item.icon;
          const isCurrent = "current" in item && item.current;
          return (
            <article className={`evolution-node node-${item.scale}${isCurrent ? " current-node" : ""}`} key={item.title}>
              <div className="node-marker"><Icon aria-hidden="true" /></div>
              <div className="node-date">{item.year}</div>
              <div className="node-card">
                <em className="node-arc">{item.arc}</em>
                <p>{item.place}</p>
                <h3>{item.title}</h3>
                <strong>{item.type}</strong>
                <span>{item.body}</span>
                {item.skills?.length ? (
                  <div className="node-skills">
                    <b>{"skillsTitle" in item ? item.skillsTitle : "Focus"}</b>
                    <div>{item.skills.map((skill) => <i key={skill}>{skill}</i>)}</div>
                  </div>
                ) : null}
                {"projects" in item && item.projects ? (
                  <div className="node-projects">
                    <b>Projects</b>
                    {item.projects.map((project) => <em key={project}>{project}</em>)}
                  </div>
                ) : null}
                {"achievement" in item && item.achievement ? <small>{item.achievement}</small> : null}
              </div>
              <span className="node-index">0{index + 1}</span>
            </article>
          );
        })}
      </div>

      <section className="learning-panel" aria-labelledby="learning-title">
        <header>
          <p>Learning timeline</p>
          <h3 id="learning-title">From markup to automated products</h3>
        </header>
        <div className="learning-track">
          <div className="learning-marquee-row">
            {[...learningMarquee, ...learningMarquee].map(({ label, icon: Icon, badge }, index) => (
              <span className="learning-step" aria-hidden={index >= learningMarquee.length} key={`${label}-${index}`}>
                {Icon ? <Icon aria-hidden="true" /> : <b aria-hidden="true">{badge}</b>}
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="evolution-grid">
        <section className="milestone-panel" aria-labelledby="milestone-title">
          <p>Career milestones</p>
          <h3 id="milestone-title">Progress built through practical work</h3>
          <div>
            {milestones.map((item, index) => (
              <span key={item}><Check aria-hidden="true" /><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
            ))}
          </div>
        </section>

        <section className="certification-panel" aria-labelledby="certification-title">
          <p>Certifications</p>
          <h3 id="certification-title">Focused learning and credentials</h3>
          <div>
            {certifications.map((item) => (
              <span key={item.label}><b aria-hidden="true">{item.badge}</b>{item.label}</span>
            ))}
          </div>
        </section>
      </div>

      <section className="currently-building" aria-labelledby="currently-title">
        <div>
          <p>Currently building</p>
          <h3 id="currently-title">Practical AI and product experiences</h3>
          <div>{building.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        <aside>
          <strong>Open to Full-time Opportunities</strong>
          <strong>Available for Freelance Projects</strong>
        </aside>
      </section>

      <section className="auto-tech-panel" aria-labelledby="auto-tech-title">
        <p>Tech used across the portfolio</p>
        <h3 id="auto-tech-title">Generated from project metadata</h3>
        <div>{autoStack.map((item) => <span key={item}>{item}</span>)}</div>
      </section>
    </section>
  );
}
