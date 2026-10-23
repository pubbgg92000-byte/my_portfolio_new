"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/command/command-palette";

export const navSections = [
  { label: "Home", section: "home" },
  { label: "Projects", section: "projects" },
  { label: "About", section: "about" },
  { label: "Skills", section: "skills" },
  { label: "Contact", section: "contact" },
] as const;

const mobileNavItems = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Journey", href: "/journey" },
  { label: "Resume", href: "/resume" },
  { label: "Focus", href: "/focus" },
  { label: "Certifications", href: "/certifications" },
  { label: "Contact", href: "/contact" },
  { label: "3D Studio", href: "/3d" },
];

type SiteHeaderProps = {
  /** Section id currently in view on the home page. Omit on secondary pages. */
  activeSection?: string;
};

export function SiteHeader({ activeSection }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(".main-nav")) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header data-boot className="main-nav">
      <Link href="/#home" className="wordmark" aria-label="Arvind, back to home">ARVIND<span aria-hidden="true">•</span></Link>
      <nav aria-label="Primary navigation">
        {navSections.map(({ label, section }) => {
          const isActive = activeSection === section;
          return (
            <a
              key={section}
              href={`/#${section}`}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "location" : undefined}
            >
              {label}
            </a>
          );
        })}
      </nav>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <div className="nav-actions">
        <Link className="nav-studio" href="/3d">Enter 3D</Link>
        <button
          type="button"
          className="palette-trigger"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT))}
          aria-label="Open command palette (Ctrl or Cmd + K)"
        >
          <Search aria-hidden="true" />
          <kbd aria-hidden="true">⌘K</kbd>
        </button>
        <a className="nav-contact" href="/resume.pdf" download>Download resume <span /></a>
      </div>
      <div
        id={panelId}
        role="navigation"
        className={`mobile-menu-panel${menuOpen ? " open" : ""}`}
        aria-label="Mobile navigation"
        inert={!menuOpen}
      >
        {mobileNavItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
        ))}
      </div>
    </header>
  );
}
