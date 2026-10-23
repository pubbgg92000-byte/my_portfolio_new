import { Hero } from "@/components/hero/hero";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { GithubActivity } from "@/components/github/github-activity";
import {
  AboutSection,
  CertificationsSection,
  ContactSection,
  CurrentFocusSection,
  LearningNowSection,
  MobileQuickActions,
  PortfolioFooter,
  ResumeSection,
  SkillsSection,
} from "@/components/sections/portfolio-sections";
import { HomeScrollMemory } from "@/components/scroll/home-scroll-memory";

export default function Home() {
  return (
    <>
      <HomeScrollMemory />
      <Hero />
      <FeaturedProjects />
      <AboutSection />
      <LearningNowSection className="mobile-secondary-section" />
      <SkillsSection />
      <GithubActivity />
      <MobileQuickActions />
      <ResumeSection className="mobile-secondary-section" />
      <CurrentFocusSection className="mobile-secondary-section" />
      <CertificationsSection className="mobile-secondary-section" />
      <ContactSection className="mobile-secondary-section" />
      <PortfolioFooter />
    </>
  );
}
