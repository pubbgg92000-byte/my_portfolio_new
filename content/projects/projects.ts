export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  status: string;
  summary: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: {
    src: string;
    alt: string;
  };
  role?: string;
  contributions?: string[];
  gallery?: {
    src: string;
    alt: string;
    caption: string;
  }[];
  detail?: {
    intro: string;
    responsibilities: string[];
    outcome: string;
  };
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
    slug: "meals-sdk-monorepo",
    title: "Meals SDK & Monorepo",
    year: "2024-2025",
    category: "Professional contribution / Multi-client platform",
    status: "Team project · Frontend contribution",
    summary: "Contributed to a SvelteKit-based multi-client meal subscription platform that supported multiple branded web experiences from a shared monorepo foundation.",
    technologies: ["SvelteKit", "TypeScript", "Tailwind CSS", "API Integration", "Monorepo"],
    role: "Frontend Developer contribution",
    image: {
      src: "/images/projects _images/banner-DZ1-L8_Q.png",
      alt: "Meals SDK and Monorepo project banner",
    },
    contributions: [
      "Built and styled client-specific frontend screens using SvelteKit and Tailwind CSS.",
      "Integrated UI flows with APIs for meal plans, subscription data, and client configuration.",
      "Supported reusable component patterns for faster rollout across multiple meal-service clients.",
    ],
    gallery: [
      { src: "/images/projects _images/banner-DZ1-L8_Q.png", alt: "Meals SDK and Monorepo banner", caption: "Project overview banner showing the shared meal-platform foundation." },
      { src: "/images/projects _images/meals-1-C0zKTUM2.png", alt: "Meal subscription web interface screen", caption: "Client-facing meal subscription interface." },
      { src: "/images/projects _images/meals-2-Czz1DXSJ.png", alt: "Meal plan listing interface", caption: "Meal-plan browsing and content layout." },
      { src: "/images/projects _images/meals-3-CbGWD8Gl.png", alt: "Meal product interface", caption: "Reusable product and plan presentation UI." },
      { src: "/images/projects _images/meals-4-BsYL2M5F.png", alt: "Meal ordering interface", caption: "Order and subscription flow screens." },
      { src: "/images/projects _images/meals-5-CTIBr8FX.png", alt: "Meal website responsive section", caption: "Responsive client page section." },
      { src: "/images/projects _images/meals-6-D-BPbuBT.png", alt: "Meal subscription content screen", caption: "Content-heavy meal service screen." },
      { src: "/images/projects _images/meals-7-YSl5uFYX.png", alt: "Meal platform UI screen", caption: "Additional platform UI state." },
      { src: "/images/projects _images/meals-mobile-C-17i31l.png", alt: "Mobile meal subscription screen", caption: "Mobile layout for the meal subscription experience." },
    ],
    detail: {
      intro: "This was a professional team project around a shared SvelteKit monorepo that could support multiple meal-subscription client websites from one reusable foundation.",
      responsibilities: [
        "Implemented client-facing SvelteKit screens and responsive layouts.",
        "Styled client-specific interface sections with Tailwind CSS.",
        "Connected UI components to API-driven meal-plan and configuration data.",
        "Worked within reusable frontend patterns so new client websites could ship faster.",
      ],
      outcome: "The work strengthened my practical experience with real product UI, client-specific variations, API-connected frontend screens, and monorepo-style delivery.",
    },
  },
  {
    slug: "apex-admin-panels",
    title: "Apex Admin Panels",
    year: "2024-2025",
    category: "Professional contribution / Enterprise dashboards",
    status: "Team project · Frontend contribution",
    summary: "Worked on data-heavy admin dashboard interfaces for Apex Meals and Apex Travel, focused on operational screens, reusable UI, and API-connected workflows.",
    technologies: ["SvelteKit", "TypeScript", "Tailwind CSS", "REST APIs", "Admin UI"],
    role: "Frontend Developer contribution",
    image: {
      src: "/images/projects _images/banner-Cteta4R4.png",
      alt: "Apex Admin Panels project banner",
    },
    contributions: [
      "Implemented dashboard screens and responsive UI states for internal operational workflows.",
      "Connected frontend components with backend API data structures and loading states.",
      "Helped turn design-system components into practical admin-panel screens.",
    ],
    gallery: [
      { src: "/images/projects _images/banner-Cteta4R4.png", alt: "Apex Admin Panels banner", caption: "Admin dashboard project overview banner." },
      { src: "/images/projects _images/admin_pannel_banner.png", alt: "Admin panel dashboard banner", caption: "Dashboard-focused admin interface presentation." },
      { src: "/images/projects _images/admin-pannel-1.png", alt: "Admin panel screen one", caption: "Operational dashboard screen." },
      { src: "/images/projects _images/admin-pannel-2.png", alt: "Admin panel screen two", caption: "Data-heavy admin workflow screen." },
      { src: "/images/projects _images/admin-pannel-3.png", alt: "Admin panel screen three", caption: "Table and management UI state." },
      { src: "/images/projects _images/admin-pannel-4.png", alt: "Admin panel screen four", caption: "Internal dashboard layout." },
      { src: "/images/projects _images/admin-pannel-5.png", alt: "Admin panel screen five", caption: "Admin form or workflow screen." },
      { src: "/images/projects _images/admin-pannel-6.png", alt: "Admin panel screen six", caption: "Additional admin dashboard state." },
    ],
    detail: {
      intro: "Apex Admin Panels involved enterprise-style internal dashboards where the priority was clarity, data handling, reusable UI, and smooth operational workflows.",
      responsibilities: [
        "Built dashboard screens using SvelteKit, TypeScript, and Tailwind CSS.",
        "Mapped frontend UI to backend API data structures and states.",
        "Implemented responsive layout behavior for internal tool screens.",
        "Used shared design-system components in real dashboard workflows.",
      ],
      outcome: "This project gave me stronger hands-on experience with admin-panel UI, dashboard structure, API-connected components, and product screens used by operations teams.",
    },
  },
  {
    slug: "apex-design-system",
    title: "Apex Design System",
    year: "2024-2025",
    category: "Professional contribution / Component system",
    status: "Team project · UI system contribution",
    summary: "Contributed to a reusable Svelte component system used as the foundation for future dashboards, internal tools, and product interfaces.",
    technologies: ["SvelteKit", "TypeScript", "Storybook", "Design Systems", "Reusable Components"],
    role: "UI system contribution",
    image: {
      src: "/images/projects _images/banner-DOo1wa9p.png",
      alt: "Apex Design System reusable component library banner",
    },
    contributions: [
      "Built and refined reusable UI components with consistent styling and TypeScript-friendly props.",
      "Worked on component states, edge cases, and layout behavior for dashboard use cases.",
      "Supported Storybook documentation so components could be reused more easily by the team.",
    ],
    gallery: [
      { src: "/images/projects _images/banner-DOo1wa9p.png", alt: "Apex Design System banner", caption: "Reusable component library overview." },
      { src: "/images/projects _images/svelte_resuable_component _lib.png", alt: "Reusable Svelte component library banner", caption: "Component-library presentation banner." },
      { src: "/images/projects _images/apex-design-systems-1-CHj4Svf4.png", alt: "Apex design system component screen one", caption: "Reusable component documentation screen." },
      { src: "/images/projects _images/apex-design-systems-2-z2M07PuW.png", alt: "Apex design system component screen two", caption: "Component state and styling reference." },
      { src: "/images/projects _images/apex-design-systems-3-CTpcM9mC.png", alt: "Apex design system component screen three", caption: "Design-system UI examples." },
      { src: "/images/projects _images/apex-design-systems-4-B9Jh9NuM.png", alt: "Apex design system component screen four", caption: "Reusable dashboard component examples." },
      { src: "/images/projects _images/apex-design-systems-5-Ds682srv.png", alt: "Apex design system component screen five", caption: "Additional component-library state." },
    ],
    detail: {
      intro: "The Apex Design System was a reusable frontend foundation for dashboards and internal tools, built around consistent Svelte components and documented usage patterns.",
      responsibilities: [
        "Built reusable Svelte UI components with consistent styling and behavior.",
        "Handled component states, responsive behavior, and practical dashboard use cases.",
        "Supported TypeScript-friendly component usage.",
        "Worked with Storybook-style documentation patterns for team reuse.",
      ],
      outcome: "This work improved my understanding of component architecture, reusable UI systems, design consistency, and building frontend foundations that other screens can depend on.",
    },
  },
  {
    slug: "mivi-official-website",
    title: "Mivi Official Website",
    year: "2024",
    category: "Professional contribution / Ecommerce web",
    status: "Client project · Frontend contribution",
    summary: "Contributed to frontend updates for Mivi's official web presence, including product-page UI, campaign landing sections, and responsive content updates.",
    technologies: ["Eleventy", "HTML", "Tailwind CSS", "JavaScript", "Responsive UI"],
    liveUrl: "https://www.mivi.in/",
    role: "Frontend Developer contribution",
    contributions: [
      "Implemented pixel-focused product and landing-page UI updates for a consumer electronics brand.",
      "Worked with static-site templates, responsive styling, and JavaScript interactions.",
      "Supported brand-aligned page sections for product launches and sales campaigns.",
    ],
    image: {
      src: "/images/projects _images/mivi-homepage.png",
      alt: "Mivi audio products displayed in a neon technology campaign visual",
    },
    gallery: [
      {
        src: "/images/projects _images/mivi-homepage.png",
        alt: "Mivi audio campaign visual featuring headphones and speakers",
        caption: "Consumer-audio campaign artwork used as the Mivi project cover.",
      },
      {
        src: "/images/projects _images/mivi-products.png",
        alt: "Mivi gaming earbuds product page with feature-focused sections",
        caption: "Long-form gaming earbuds page highlighting playtime, gaming mode, charging, and bass features.",
      },
      {
        src: "/images/projects _images/mivi-brand-section.png",
        alt: "Desktop and mobile Mivi Black Friday ecommerce layouts",
        caption: "Responsive Black Friday campaign experience across desktop, mobile, and banner formats.",
      },
      {
        src: "/images/projects _images/mivi-design-contest.png",
        alt: "Mivi Big Design Contest landing page and registration form",
        caption: "Big Design Contest campaign page with awards, competition details, and a responsive registration form.",
      },
    ],
    detail: {
      intro: "Mivi Official Website was professional frontend contribution work for a consumer electronics brand, focused on maintaining polished product and campaign pages.",
      responsibilities: [
        "Implemented product-page and landing-page UI updates.",
        "Worked with static-site templates, Tailwind CSS, HTML, and JavaScript.",
        "Supported responsive styling and brand-aligned content sections.",
        "Handled practical website update work around product and campaign needs.",
      ],
      outcome: "This gave me experience with brand-focused frontend work, pixel attention, responsive content updates, and maintaining production-style pages.",
    },
  },
  {
    slug: "staffly",
    title: "Staffly",
    year: "2026",
    category: "HRMS / Internal product",
    status: "Portfolio case study · In development",
    summary: "An HRMS learning build exploring multi-role dashboards, employee management, attendance, leave, and internal admin workflows with automation support.",
    technologies: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL"],
    liveUrl: "https://staffly-admin.vercel.app/auth/sign-in?from=%2F",
    githubUrl: "https://github.com/pubbgg92000-byte/staffly",
    image: {
      src: "/images/projects _images/staffly_page-1.png",
      alt: "Staffly admin dashboard audit log screen",
    },
    gallery: [
      { src: "/images/projects _images/staffly_page-1.png", alt: "Staffly audit log screen", caption: "Admin audit log with filters and activity records." },
      { src: "/images/projects _images/staffly_page-2.png", alt: "Staffly dashboard screen", caption: "HRMS dashboard workflow screen." },
      { src: "/images/projects _images/staffly_page-3.png", alt: "Staffly employee management screen", caption: "Employee and organization management UI." },
      { src: "/images/projects _images/staffly_page-4.png", alt: "Staffly attendance or leave screen", caption: "Attendance, leave, or internal workflow screen." },
      { src: "/images/projects _images/staffly_page-5.png", alt: "Staffly admin settings screen", caption: "Admin configuration and internal tool screen." },
      { src: "/images/projects _images/staffly_page-6.png", alt: "Staffly HRMS interface screen", caption: "Additional HRMS product interface state." },
    ],
    detail: {
      intro: "Staffly is a multi-role HRMS product build focused on admin and employee workflows across attendance, leave, audit logs, employee data, and internal organization management.",
      responsibilities: [
        "Built product-facing admin screens for HR and internal operations workflows.",
        "Worked on dashboard layouts, data tables, filtering states, and role-specific navigation.",
        "Connected the frontend experience around realistic HRMS entities and demo credentials.",
        "Focused on scalable UI patterns for a SaaS-style internal product.",
      ],
      outcome: "This project demonstrates my ability to structure a practical business application with multi-role flows, operational dashboards, and polished internal-tool UI.",
    },
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
    summary: "A sculpture and gallery experience exploring editorial storytelling, atmosphere, interaction, and premium visual presentation.",
    technologies: ["Next.js", "React", "TypeScript", "GSAP"],
    liveUrl: "https://sculpt-verse.vercel.app/",
    githubUrl: "https://github.com/pubbgg92000-byte/sculpt_verse",
    image: {
      src: "/images/projects _images/sculptverse_hero.png",
      alt: "Sculpt Verse custom sculpture website hero section",
    },
    gallery: [
      { src: "/images/projects _images/sculptverse_hero.png", alt: "Sculpt Verse hero section", caption: "Homepage hero for the custom sculpture brand experience." },
      { src: "/images/projects _images/sculpt_verse-1.png", alt: "Sculpt Verse page section", caption: "Editorial sculpture website section." },
      { src: "/images/projects _images/sculptverse_2.png", alt: "Sculpt Verse visual section", caption: "Atmospheric visual section from the Sculpt Verse website." },
      { src: "/images/projects _images/sculpt-verse.vercel.app_services.png", alt: "Sculpt Verse services screen", caption: "Services page layout for sculpture offerings." },
      { src: "/images/projects _images/sculpt-verse.vercel.app_services (1).png", alt: "Sculpt Verse services section one", caption: "Detailed services and product storytelling section." },
      { src: "/images/projects _images/sculpt-verse.vercel.app_services (2).png", alt: "Sculpt Verse services section two", caption: "Additional service detail section and visual layout." },
    ],
    detail: {
      intro: "Sculpt Verse is an immersive editorial website concept for custom sculpture and garden feature services, built around premium visual presentation and conversion-focused storytelling.",
      responsibilities: [
        "Designed and built a cinematic landing experience with strong hero imagery and brand atmosphere.",
        "Created service and process sections that explain custom sculpture offerings clearly.",
        "Used motion and visual hierarchy to make the site feel premium without losing readability.",
        "Structured the site around quote/contact conversion points.",
      ],
      outcome: "This project shows my frontend and UI direction for premium business websites, combining visual storytelling, responsive layout, and conversion-aware sections.",
    },
  },
  {
    slug: "pro-shoot",
    title: "Pro Shoot",
    year: "2026",
    category: "Creative business showcase",
    status: "Portfolio case study · In development",
    summary: "A photography showcase exploring premium brand presentation, service storytelling, and conversion-aware website design.",
    technologies: ["Next.js", "React", "TypeScript", "Responsive UI"],
    liveUrl: "https://proshoot-gamma.vercel.app/",
    githubUrl: "https://github.com/pubbgg92000-byte/pro_shoot",
    image: {
      src: "/images/projects _images/proshoot-gamma.vercel.app_.png",
      alt: "Pro Shoot premium photography homepage hero",
    },
    gallery: [
      { src: "/images/projects _images/proshoot-gamma.vercel.app_.png", alt: "Pro Shoot homepage hero", caption: "Premium photography landing page hero." },
      { src: "/images/projects _images/proshoot-gamma.vercel.app_ (1).png", alt: "Pro Shoot portfolio gallery page", caption: "Portfolio gallery with photography categories and image cards." },
      { src: "/images/projects _images/proshoot-gamma.vercel.app_about.png", alt: "Pro Shoot about page", caption: "About/story section for the photography brand." },
    ],
    detail: {
      intro: "Pro Shoot is a premium photography website concept focused on cinematic storytelling, portfolio presentation, service discovery, and booking intent.",
      responsibilities: [
        "Built a visual landing page with premium typography, photography-led layout, and clear calls to action.",
        "Created portfolio and brand sections that highlight photography categories and trust.",
        "Focused on responsive UI polish for image-heavy content.",
        "Structured pages around booking, exploration, and brand storytelling.",
      ],
      outcome: "This project highlights my ability to design and build image-heavy brand websites with strong visual hierarchy, gallery presentation, and conversion paths.",
    },
  },
];

export const experiments: Experiment[] = [
  {
    slug: "forest-life",
    title: "EDEN / Forest Life",
    category: "Cinematic nature web",
    summary: "A Next.js environmental universe exploring floating botanical worlds, atmospheric particles, ambient audio, Lenis smooth scrolling, and GSAP/Framer Motion parallax.",
    technologies: ["Next.js", "GSAP", "Framer Motion", "Lenis"],
    liveUrl: "https://forest-life-rho.vercel.app/",
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
    liveUrl: "https://moosetrialglb.vercel.app/",
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
