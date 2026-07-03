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
