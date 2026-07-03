import { Hero } from "@/components/hero/hero";
import { ExperienceEvolution } from "@/components/experience/experience-evolution";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { PortfolioSections } from "@/components/sections/portfolio-sections";

export default function Home() {
  return <><Hero /><FeaturedProjects /><ExperienceEvolution /><PortfolioSections /></>;
}
