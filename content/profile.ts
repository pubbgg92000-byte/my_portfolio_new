export const profile = {
  name: "Mangalarapu Arvind",
  shortName: "Arvind M",
  role: "Frontend Developer & AI Automation Engineer",
  location: "Hyderabad, India",
  email: "mangalarapuarvind@gmail.com",
  summary:
    "I design and build polished product interfaces, internal tools, business websites, and modern frontend experiences with practical automation support and scalable engineering.",
  availability: "Open to full-time and freelance work",
  resumeUrl: "/resume.pdf",
  portraitUrl: "/images/profile/Arvind_profile.webp",
  socials: {
    github: "https://github.com/pubbgg92000-byte",
    linkedin: "https://www.linkedin.com/in/mangalarapu-arvind-dev/",
  },
  skillGroups: [
    { title: "Frontend", items: ["React", "Next.js", "JavaScript", "Svelte", "Tailwind CSS", "GSAP", "Three.js"] },
    { title: "Backend", items: ["Node.js", "NestJS", "REST APIs", "PostgreSQL", "Prisma", "Basic Python"] },
    { title: "AI Tools", items: ["OpenAI", "Gemini", "Claude", "Prompt Engineering", "Agent Workflows"] },
    { title: "Automation", items: ["Playwright", "Apps Script", "n8n", "Selenium", "CLI Tools"] },
    { title: "Cloud", items: ["Docker", "AWS", "Cloudflare", "Vercel", "GitHub Actions"] },
  ],
  journey: [
    { period: "2017–2021", title: "Mechanical Engineering", detail: "Engineering discipline, systems thinking, and project execution." },
    { period: "2020–2023", title: "Business Operations", detail: "Customer experience, pricing, inventory, suppliers, and daily ownership." },
    { period: "2024–2025", title: "Frontend Development", detail: "SaaS interfaces, reusable components, API integration, and responsive product UI." },
    { period: "2025–Now", title: "AI Automation", detail: "Agentic workflows, developer tools, interactive products, and automation-supported systems." },
  ],
  certifications: [
    "Generative AI Mastermind",
    "AI Workflow Automation",
    "n8n Workflow Automation",
    "Prompt Engineering",
    "Frontend Development",
    "Selenium & Playwright Automation",
  ],
} as const;

export const profileEmailUrl = `mailto:${profile.email}`;
