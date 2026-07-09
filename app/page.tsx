import { Hero } from "@/components/hero/hero";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { PortfolioSections } from "@/components/sections/portfolio-sections";
import { HomeScrollMemory } from "@/components/scroll/home-scroll-memory";

export default function Home() {
  return <><HomeScrollMemory /><Hero /><FeaturedProjects /><PortfolioSections /></>;
}
