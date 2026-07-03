"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown, ArrowRight, Braces, Code2, Download, Github,
  Linkedin, Mail, PanelsTopLeft, Server, Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
const FRAME_COUNT = 300;
const FRAME_LOADERS = 6;
const dynamicWords = [
  "Intelligent",
  "AI-Powered",
  "Frontend",
  "Full Stack",
  "Automation",
  "Enterprise",
  "Scalable",
  "Interactive",
  "Creative",
  "Digital",
];

const tech = [
  { name: "React", icon: Sparkles }, { name: "Next.js", icon: PanelsTopLeft },
  { name: "TypeScript", icon: Braces }, { name: "GSAP", label: "GSAP" },
  { name: "Node.js", icon: Server }, { name: "AI", icon: Code2 },
];

const navItems = ["Home", "About", "Projects", "Experience", "Contact"];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const scope = root.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!scope || !canvas || !context) return;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    const playhead = { frame: 0 };
    let cancelled = false;
    let introStarted = false;
    let activeWordIndex = 0;
    let idleTween: gsap.core.Tween | null = null;
    let scrollTween: gsap.core.Tween | null = null;
    let projectTrigger: ScrollTrigger | null = null;
    const navTriggers: ScrollTrigger[] = [];

    const setActiveNav = (section: string) => {
      setActiveSection((current) => (current === section ? current : section));
    };

    const render = () => {
      const requested = Math.round(playhead.frame);
      let image = images[requested];
      if (!image?.complete || !image.naturalWidth) {
        for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
          const fallback = images[(requested - offset + FRAME_COUNT) % FRAME_COUNT];
          if (fallback?.complete && fallback.naturalWidth) { image = fallback; break; }
        }
      }
      if (!image?.naturalWidth) return;
      canvas.dataset.frame = String(requested);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    };

    const getWordStep = () => {
      const word = scope.querySelector<HTMLElement>(".dynamic-word-track strong");
      return word?.offsetHeight || 0;
    };

    const createScrollStory = () => {
      if (cancelled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const mobileStory = window.matchMedia("(max-width: 780px)").matches;
      if (!mobileStory) {
        idleTween = gsap.to(playhead, { frame: 138, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: render });
      }
      gsap.set(".dynamic-word-track", { y: 0 });
      gsap.set(".dynamic-word-mask", { clipPath: "none", y: 0 });
      gsap.set(".line-experiences", { clipPath: "none", y: 0 });
      scrollTween = gsap.to(playhead, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: ".hero-stage",
          start: "top top",
          end: mobileStory ? "+=1050" : "+=2200",
          scrub: mobileStory ? .65 : 1.05,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            const isMobile = mobileStory;
            if (progress > .005) idleTween?.pause(); else idleTween?.play();
            if (progress < 1) setActiveNav("home");
            const railProgress = gsap.utils.clamp(0, 1, progress);
            const nextWordIndex = Math.min(
              dynamicWords.length - 1,
              Math.floor(railProgress * (dynamicWords.length - 0.001)),
            );
            if (nextWordIndex !== activeWordIndex) {
              const direction = nextWordIndex > activeWordIndex ? 1 : -1;
              activeWordIndex = nextWordIndex;
              gsap.to(".dynamic-word-track", {
                y: -getWordStep() * activeWordIndex,
                duration: .6,
                ease: "power4.out",
                overwrite: true,
              });
              gsap.fromTo(".robot-world", {
                rotate: direction * .22,
                y: direction * -4,
              }, {
                rotate: 0,
                y: 0,
                duration: .72,
                ease: "power4.out",
                overwrite: "auto",
              });
              gsap.fromTo(".chest-glow", {
                opacity: .8,
                scale: 1.16,
              }, {
                opacity: .42,
                scale: 1,
                duration: .68,
                ease: "power4.out",
                overwrite: "auto",
              });
            }
            const textFade = gsap.utils.clamp(0, 1, (progress - .9) / .1);
            gsap.set(".hero-content", {
              opacity: isMobile ? 1 : 1 - textFade * .78,
              y: isMobile ? 0 : -18 * textFade,
            });
            gsap.set(".tech-dock", {
              opacity: isMobile ? 1 : 1 - textFade,
            });
            gsap.set(".scroll-hint", { opacity: progress < .02 ? 1 : 0 });
            gsap.set(".robot-world", {
              x: isMobile ? 0 : progress > .15 ? Math.min(20, (progress - .15) * 60) : 0,
              scale: isMobile ? 1 : progress > .4 ? 1 - Math.min(.08, (progress - .4) * .14) : 1,
              opacity: isMobile ? 1 : progress > .82 ? 1 - (progress - .82) / .18 : 1,
            });
          },
        },
      });
      projectTrigger = ScrollTrigger.create({
        trigger: ".featured-projects",
        start: "top 82%",
        once: true,
        onEnter: () => gsap.fromTo(".project-row", { clipPath: "inset(0 0 100% 0)", y: 30 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1, stagger: .12, ease: "power3.out" }),
      });
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        navTriggers.push(ScrollTrigger.create({
          trigger: projectsSection,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => setActiveNav("projects"),
          onEnterBack: () => setActiveNav("projects"),
          onLeaveBack: () => setActiveNav("home"),
        }));
      }
      navItems
        .map((label) => label.toLowerCase())
        .filter((section) => section !== "home" && section !== "projects")
        .forEach((section) => {
          const element = document.getElementById(section);
          if (!element) return;
          navTriggers.push(ScrollTrigger.create({
            trigger: element,
            start: "top 62%",
            end: "bottom 38%",
            onEnter: () => setActiveNav(section),
            onEnterBack: () => setActiveNav(section),
          }));
        });
    };

    const startIntro = () => {
      if (introStarted || cancelled) return;
      introStarted = true;
      canvas.classList.add("ready");
      render();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        render();
        return;
      }
      createScrollStory();
    };

    let nextFrame = 0;
    const loadFrame = (index: number) => new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = index === 0 ? "high" : "low";
      image.onload = () => {
        images[index] = image;
        if (!cancelled && index === 0) startIntro();
        resolve();
      };
      image.onerror = () => resolve();
      image.src = `/images/robot-frames/frame_${String(index).padStart(6, "0")}.png`;
    });
    const loadWorker = async () => {
      while (!cancelled) {
        const index = nextFrame;
        nextFrame += 1;
        if (index >= FRAME_COUNT) return;
        await loadFrame(index);
      }
    };
    void Promise.all(Array.from({ length: FRAME_LOADERS }, loadWorker));

    const moveX = gsap.quickTo(canvas, "x", { duration: .6, ease: "power2.out" });
    const moveY = gsap.quickTo(canvas, "y", { duration: .6, ease: "power2.out" });
    const onPointerMove = (event: PointerEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      moveX((event.clientX / window.innerWidth - .5) * 8);
      moveY((event.clientY / window.innerHeight - .5) * 8);
      gsap.set(".cursor-ring", { x: event.clientX, y: event.clientY });
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", render);
    return () => {
      cancelled = true;
      idleTween?.kill(); projectTrigger?.kill();
      navTriggers.forEach((trigger) => trigger.kill());
      scrollTween?.scrollTrigger?.kill(); scrollTween?.kill();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", render);
    };
  }, []);

  return (
    <main ref={root} className="portfolio-hero">
      <div className="cursor-ring" aria-hidden="true" />
      <header data-boot className="main-nav">
        <a href="#home" className="wordmark">ARVIND<span>•</span></a>
        <nav aria-label="Primary navigation">
          {navItems.map((label) => {
            const section = label.toLowerCase();
            const isActive = activeSection === section;
            return (
              <a
                key={label}
                href={`#${section}`}
                className={isActive ? "active" : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <a className="nav-contact" href="mailto:mangalarapuarvind@gmail.com">Let&apos;s connect <span /></a>
      </header>

      <section id="home" className="hero-stage" aria-labelledby="hero-title">
        <div className="ambient-rings" aria-hidden="true" />
        <div className="chest-glow" aria-hidden="true" />
        <div className="robot-world" aria-label="A.R.V.I.N.D animated AI robot">
          <canvas ref={canvasRef} />
        </div>

        <div className="hero-content">
          <p data-boot className="hero-label"><i /> AI-powered frontend engineer</p>
          <h1 id="hero-title">
            <span className="line-building">Building</span>
            <span className="dynamic-word-mask" aria-live="polite">
              <span className="dynamic-word-track">
                {dynamicWords.map((word) => <strong key={word}>{word}</strong>)}
              </span>
            </span>
            <span className="line-experiences">Experiences</span>
          </h1>
          <p data-boot className="hero-summary">I design and build polished product interfaces, internal tools, business websites, and AI-assisted digital experiences—with thoughtful motion and scalable engineering.</p>
          <div className="hero-actions"><a data-boot className="hero-button primary" href="#projects">View selected work <ArrowRight /></a><a data-boot className="hero-button secondary" href="/resume.pdf" download>Download résumé <Download /></a></div>
          <div data-boot className="hero-socials"><span>Find me on</span><a href="https://github.com/pubbgg92000-byte" aria-label="GitHub"><Github /></a><a href="https://www.linkedin.com/in/arvind-m-6645a8251/" aria-label="LinkedIn"><Linkedin /></a><a href="mailto:mangalarapuarvind@gmail.com" aria-label="Email"><Mail /></a></div>
        </div>

        <div data-boot className="tech-dock"><p>Core stack</p>{tech.map(({ name, icon: Icon, label }) => <div key={name}>{Icon ? <Icon /> : <b>{label}</b>}<span>{name}</span></div>)}</div>
        <a data-boot className="scroll-hint" href="#projects"><ArrowDown /> Scroll to activate</a>
      </section>
    </main>
  );
}
