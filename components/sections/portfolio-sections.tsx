"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Boxes,
  Braces,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Container,
  Coffee,
  Cpu,
  Database,
  Download,
  FileCode2,
  GitBranch,
  Github,
  Globe,
  Layers3,
  Linkedin,
  Mail,
  Network,
  PanelsTopLeft,
  Printer,
  Rocket,
  Server,
  Sparkles,
  Terminal,
  Utensils,
  WandSparkles,
  Workflow,
} from "lucide-react";

const aboutCards = [
  { title: "Mission", body: "Build useful products that combine polished interfaces, AI workflows, and practical automation." },
  { title: "Journey", body: "Mechanical engineering, business operations, frontend product work, and now AI-powered full-stack systems." },
  { title: "Current Focus", body: "AI agents, Staffly HRMS, interactive portfolio systems, and automation workflows." },
  { title: "Values", body: "Clarity, ownership, honest learning, business awareness, and interfaces that respect the person using them." },
];

const facts = [
  { label: "Coffee", icon: Coffee, detail: "Fuel for long debugging sessions and focused build days." },
  { label: "Photography", icon: Camera, detail: "A visual habit that sharpens composition and product presentation." },
  { label: "Cooking", icon: Utensils, detail: "The same patience: prep, timing, taste, iteration." },
  { label: "Technology", icon: Cpu, detail: "Always testing new tools, workflows, and AI-assisted ways to build." },
  { label: "Business", icon: BriefcaseBusiness, detail: "Grocery operations taught pricing, customers, inventory, and ownership." },
];

type IconType = typeof Code2;

const currentlyLearning = [
  { label: "React", icon: Sparkles },
  { label: "Next.js", icon: PanelsTopLeft },
  { label: "Basic Python", icon: Code2 },
  { label: "AI Agents", icon: Bot },
  { label: "Three.js", icon: Boxes },
  { label: "System Design", icon: Network },
];

type SkillItem = {
  name: string;
  icon: IconType;
};

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: [
      { name: "React", icon: Sparkles },
      { name: "Next.js", icon: PanelsTopLeft },
      { name: "JavaScript", icon: Braces },
      { name: "Tailwind", icon: Layers3 },
      { name: "Svelte", icon: FileCode2 },
      { name: "GSAP", icon: WandSparkles },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", icon: Server },
      { name: "NestJS", icon: Boxes },
      { name: "Basic Python", icon: Code2 },
      { name: "REST APIs", icon: Network },
      { name: "PostgreSQL", icon: Database },
      { name: "Prisma", icon: GitBranch },
    ],
  },
  {
    title: "Applied AI",
    icon: Bot,
    skills: [
      { name: "Gemini", icon: Sparkles },
      { name: "OpenAI", icon: Bot },
      { name: "Claude", icon: Cpu },
      { name: "Prompt Engineering", icon: Code2 },
      { name: "Agent Workflows", icon: Workflow },
    ],
  },
  {
    title: "Automation",
    icon: Rocket,
    skills: [
      { name: "Playwright", icon: Globe },
      { name: "Apps Script", icon: FileCode2 },
      { name: "n8n", icon: Workflow },
      { name: "Selenium", icon: Check },
      { name: "CLI Tools", icon: Terminal },
    ],
  },
  {
    title: "Cloud",
    icon: Cloud,
    skills: [
      { name: "Docker", icon: Container },
      { name: "AWS", icon: Cloud },
      { name: "Cloudflare", icon: Globe },
      { name: "Vercel", icon: PanelsTopLeft },
      { name: "GitHub Actions", icon: GitBranch },
    ],
  },
] satisfies { title: string; icon: IconType; skills: SkillItem[] }[];

const resumeSummary = [
  { label: "Experience", value: "Frontend Developer at Uncommon Design Services; SaaS UI, API integration, testing, debugging, Cloudflare deployment support." },
  { label: "Education", value: "B.Tech Mechanical Engineering, Holy Mary Group of Institutions. Diploma Mechanical Engineering, St. Marys Group of Institutions." },
  { label: "Skills", value: "React, Basic Python, Svelte, JavaScript, HTML, CSS, Tailwind, REST APIs, Git, Cloudflare, n8n, AI workflows, prompt engineering, Selenium basics." },
];

const focusItems = [
  { label: "AI Agents", icon: Bot },
  { label: "Staffly HRMS", icon: BriefcaseBusiness },
  { label: "Interactive Portfolio", icon: PanelsTopLeft },
  { label: "Automation Workflows", icon: Workflow },
  { label: "Open To Work", icon: Check },
];
const journeyItems = ["Mechanical", "Business", "Frontend", "Applied AI"];

const certificates = [
  { achievement: "Generative AI Mastermind", organization: "Outskill", year: "2026", view: "Resume" },
  { achievement: "AI Automation and Workflow Building", organization: "Self-Learning", year: "2026", view: "Resume" },
  { achievement: "n8n Workflow Automation", organization: "Self-Learning", year: "2026", view: "Resume" },
  { achievement: "Prompt Engineering and AI Tool Usage", organization: "Self-Learning", year: "2026", view: "Resume" },
  { achievement: "Frontend Development with Svelte and Tailwind CSS", organization: "Hands-on Training", year: "2024", view: "Resume" },
  { achievement: "Selenium Automation Testing Basics", organization: "Course/Practice", year: "2024", view: "Resume" },
];

const contactCards = [
  { label: "Email", value: "mangalarapuarvind@gmail.com", href: "mailto:mangalarapuarvind@gmail.com", icon: Mail },
  { label: "GitHub", value: "pubbgg92000-byte", href: "https://github.com/pubbgg92000-byte", icon: Github },
  { label: "LinkedIn", value: "Arvind M", href: "www.linkedin.com/in/mangalarapu-arvind-dev", icon: Linkedin },
  { label: "Resume", value: "Download PDF", href: "/resume.pdf", icon: Download },
];

export function PortfolioSections() {
  return (
    <>
      <AboutSection />
      <LearningNowSection className="mobile-secondary-section" />
      <SkillsSection />
      <ResumeSection className="mobile-secondary-section" />
      <CurrentFocusSection className="mobile-secondary-section" />
      <CertificationsSection className="mobile-secondary-section" />
      <ContactSection className="mobile-secondary-section" />
      <PortfolioFooter />
    </>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="story-section about-section" aria-labelledby="about-title">
      <div className="about-portrait" aria-label="Animated Arvind identity portrait">
        <img src="/images/my_profile _pic/Arvind_profile.png" alt="Portrait of Arvind" />
        <span>Frontend + Applied AI</span>
      </div>
      <div className="about-copy">
        <p className="section-kicker">AI & Full Stack Developer</p>
        <h2 id="about-title">Hello, I&apos;m Arvind.</h2>
        <h3>I build intelligent web experiences with frontend craft, business context, and practical AI automation.</h3>
        <p>
          My path started in mechanical engineering, moved through real business operations, and became a software journey focused on frontend systems, SaaS products, AI workflows, and practical automation.
        </p>
        <div className="about-journey" aria-label="About journey">
          <div>
            {journeyItems.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </div>
      <div className="about-card-grid">
        {aboutCards.map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
      <div className="fun-facts">
        {facts.map(({ label, icon: Icon, detail }) => (
          <article key={label}>
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LearningNowSection({ className = "" }: { className?: string }) {
  return (
    <section className={`story-section learning-now ${className}`.trim()} aria-labelledby="learning-now-title">
      <p className="section-kicker">Currently learning</p>
      <h2 id="learning-now-title">Current focus</h2>
      <div>
        {currentlyLearning.map(({ label, icon: Icon }) => (
          <span key={label}><Icon aria-hidden="true" />{label}</span>
        ))}
      </div>
    </section>
  );
}

export function SkillsSection() {
  const [openSkill, setOpenSkill] = useState("Frontend");

  return (
    <section id="skills" className="story-section skills-section" aria-labelledby="skills-title">
      <header>
        <p className="section-kicker">Skills</p>
        <h2 id="skills-title">Built around the tools I actually use.</h2>
      </header>
      <div className="skill-accordion">
        {skillGroups.map((group) => {
          const Icon = group.icon;
          const isOpen = openSkill === group.title;
          return (
            <article className={isOpen ? "open" : ""} key={group.title}>
              <button type="button" onClick={() => setOpenSkill(isOpen ? "" : group.title)} aria-expanded={isOpen}>
                <span><Icon aria-hidden="true" />{group.title}</span>
                <ChevronDown aria-hidden="true" />
              </button>
              <div className="skill-panel">
                {group.skills.map(({ name, icon: SkillIcon }) => (
                  <section key={name}>
                    <span className="skill-mark" aria-hidden="true"><SkillIcon /></span>
                    <h3>{name}</h3>
                  </section>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ResumeSection({ className = "" }: { className?: string }) {
  return (
    <section id="resume" className={`story-section resume-section ${className}`.trim()} aria-labelledby="resume-title">
      <header>
        <p className="section-kicker">Resume</p>
        <h2 id="resume-title">Preview, download, print, connect.</h2>
        <div className="resume-actions">
          <a href="/resume.pdf" target="_blank" rel="noreferrer"><ArrowUpRight aria-hidden="true" />Preview</a>
          <a href="/resume.pdf" download><Download aria-hidden="true" />Download</a>
          <button type="button" onClick={() => window.print()}><Printer aria-hidden="true" />Print</button>
          <a href="www.linkedin.com/in/mangalarapu-arvind-dev" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" />LinkedIn</a>
        </div>
      </header>
      <div className="resume-command">
        <div>
          <span>Frontend Developer</span>
          <strong>Mangalarapu Arvind</strong>
          <p>Hyderabad, India</p>
        </div>
        <div>
          <span>Current Direction</span>
          <strong>AI + Automation</strong>
          <p>Product interfaces, workflow systems, and practical AI agent experiments.</p>
        </div>
      </div>
      <div className="resume-summary">
        {resumeSummary.map((item) => (
          <article key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CurrentFocusSection({ className = "" }: { className?: string }) {
  return (
    <section className={`story-section current-focus ${className}`.trim()} aria-labelledby="focus-title">
      <p className="section-kicker">Current focus</p>
      <h2 id="focus-title">Open to full-time and freelance work</h2>
      <div>
        {focusItems.map(({ label, icon: Icon }) => (
          <span key={label}><Icon aria-hidden="true" />{label}</span>
        ))}
      </div>
    </section>
  );
}

export function CertificationsSection({ className = "" }: { className?: string }) {
  return (
    <section id="certifications" className={`story-section cert-section ${className}`.trim()} aria-labelledby="cert-title">
      <p className="section-kicker">Certifications</p>
      <h2 id="cert-title">Achievement trail</h2>
      <div className="certificate-timeline">
        {certificates.map((item) => (
          <article key={item.achievement}>
            <span>{item.year}</span>
            <h3>{item.achievement}</h3>
            <p>{item.organization}</p>
            <a href="/resume.pdf"><ArrowUpRight aria-hidden="true" />{item.view}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ContactSection({ className = "" }: { className?: string }) {
  return (
    <section id="contact" className={`story-section contact-section ${className}`.trim()} aria-labelledby="contact-title">
      <p className="section-kicker">Contact</p>
      <h2 id="contact-title">Let&apos;s build something great</h2>
      <div className="availability-strip">
        <strong><Check aria-hidden="true" />Available</strong>
        <span>Remote</span>
        <span>Hybrid</span>
        <span>Freelance</span>
      </div>
      <div className="contact-grid">
        {contactCards.map(({ label, value, href, icon: Icon }) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
            <strong>{value}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="system-footer">
      <p>SYSTEM SHUTDOWN</p>
      <span>Building Intelligent Experiences</span>
      <strong>ARVIND</strong>
      <small>2026</small>
      <i aria-hidden="true" />
    </footer>
  );
}
