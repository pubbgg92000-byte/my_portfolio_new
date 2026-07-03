export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  status: string;
  summary: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  demoCredentials?: {
    role: string;
    email: string;
    password: string;
    loginUrl: string;
  }[];
};

export type Experiment = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "staffly",
    title: "Staffly",
    year: "2026",
    category: "HRMS / Internal product",
    status: "Portfolio case study · In development",
    summary: "An AI-assisted HRMS learning build exploring multi-role dashboards, employee management, attendance, leave, and internal admin workflows.",
    technologies: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL"],
    liveUrl: "https://staffly-admin.vercel.app/auth/sign-in?from=%2F",
    githubUrl: "https://github.com/pubbgg92000-byte/staffly",
    demoCredentials: [
      {
        role: "Admin",
        email: "superadmin@acme.demo",
        password: "tAT53daNic5pUsauvHrRfOgs",
        loginUrl: "https://staffly-admin.vercel.app/auth/sign-in?from=%2F",
      },
      {
        role: "Employee",
        email: "employee@acme.demo",
        password: "Employee@123",
        loginUrl: "https://staffly-employee.vercel.app/auth/sign-in",
      },
    ],
  },
  {
    slug: "sculpt-verse",
    title: "Sculpt Verse",
    year: "2026",
    category: "Immersive editorial web",
    status: "Portfolio case study · In development",
    summary: "An AI-assisted sculpture and gallery experience exploring editorial storytelling, atmosphere, interaction, and premium visual presentation.",
    technologies: ["Next.js", "React", "TypeScript", "GSAP"],
    liveUrl: "https://sculpt-verse.vercel.app/",
    githubUrl: "https://github.com/pubbgg92000-byte/sculpt_verse",
  },
  {
    slug: "pro-shoot",
    title: "Pro Shoot",
    year: "2026",
    category: "Creative business showcase",
    status: "Portfolio case study · In development",
    summary: "An AI-assisted photography showcase exploring premium brand presentation, service storytelling, and conversion-aware website design.",
    technologies: ["Next.js", "React", "TypeScript", "Responsive UI"],
    liveUrl: "https://proshoot-gamma.vercel.app/",
    githubUrl: "https://github.com/pubbgg92000-byte/pro_shoot",
  },
];

export const experiments: Experiment[] = [
  {
    slug: "forest-life",
    title: "EDEN / Forest Life",
    category: "Cinematic nature web",
    summary: "A Next.js environmental universe exploring floating botanical worlds, atmospheric particles, ambient audio, Lenis smooth scrolling, and GSAP/Framer Motion parallax.",
    technologies: ["Next.js", "GSAP", "Framer Motion", "Lenis"],
    liveUrl: "https://vercel.com/officialprimechat-cells-projects/forest-life",
    githubUrl: "https://github.com/pubbgg92000-byte/forest_life",
  },
  {
    slug: "titan-temp-mail",
    title: "Titan Temp Mail",
    category: "Private OTP testing",
    summary: "A SvelteKit, Supabase, and Titan Mail catch-all receiver with a quick OTP route, IMAP worker, permission-gated dashboard, admin controls, and rate-limited inbox APIs.",
    technologies: ["SvelteKit", "Supabase", "Titan IMAP", "RLS"],
    liveUrl: "https://titan-temp-mail.vercel.app/",
    githubUrl: "https://github.com/pubbgg92000-byte/my_temp_mail",
  },
  {
    slug: "3d-animal-world",
    title: "Wild Trails",
    category: "Interactive 3D ecosystem",
    summary: "A React Three Fiber nature experience with seeded meadow generation, dynamic time-of-day, water systems, autonomous wildlife needs, and ecosystem commands.",
    technologies: ["React 19", "R3F", "Three.js", "Vite"],
    liveUrl: "https://vercel.com/officialprimechat-cells-projects/moose_trial_glb",
    githubUrl: "https://github.com/pubbgg92000-byte/3D_animal_world",
  },
  {
    slug: "auto-job-search-apply",
    title: "Career-Ops Adaptation",
    category: "Job-search operations",
    summary: "A local job-search command-center adaptation for evaluating roles, scanning portals, generating tailored PDFs, tracking applications, and keeping humans in the final decision loop.",
    technologies: ["JavaScript", "Playwright", "PDF", "Automation"],
    githubUrl: "https://github.com/pubbgg92000-byte/auto_job_search_apply",
  },
  {
    slug: "iopaint-bulk",
    title: "IOPaint Bulk",
    category: "AI image tooling",
    summary: "A Hugging Face Space fork/adaptation of IOPaint, focused on AI inpainting and object removal with batch-oriented cleanup workflows.",
    technologies: ["Python", "Docker", "Inpainting", "Hugging Face"],
    liveUrl: "https://arvind4632-iopaint-bulk.hf.space/",
    githubUrl: "https://github.com/pubbgg92000-byte/IOPaint",
  },
  {
    slug: "desktop-organizer",
    title: "Desktop Organizer",
    category: "Local automation",
    summary: "A local, rule-based file organizer with CLI and Telegram bot controls, SHA256 duplicate detection, reversible moves, trash review, file watching, scheduling, and dry-runs.",
    technologies: ["Python", "CLI", "Telegram Bot", "Launchd"],
    githubUrl: "https://github.com/pubbgg92000-byte/desktop_organizer",
  },
  {
    slug: "shoot-asset",
    title: "Pro Shoot Asset Manager",
    category: "Creative asset pipeline",
    summary: "A production-oriented image asset manager for Pro Shoot that searches stock providers, scores South Indian wedding fit, deduplicates images, stores SQLite metadata, and exports image packs.",
    technologies: ["TypeScript", "SQLite", "Provider APIs", "Exports"],
    githubUrl: "https://github.com/pubbgg92000-byte/shoot_assest",
  },
  {
    slug: "fit-ai-pro",
    title: "Fit AI Pro",
    category: "Mobile product prototype",
    summary: "A Flutter mobile app with a NestJS API foundation, deterministic local demo data, and planned contracts for auth, health data, nutrition, workouts, AI conversations, and subscriptions.",
    technologies: ["Flutter", "Dart", "NestJS", "Prisma"],
    githubUrl: "https://github.com/pubbgg92000-byte/fit_AI_pro",
  },
];
