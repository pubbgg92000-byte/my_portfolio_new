import { PortfolioFooter, ResumeSection } from "@/components/sections/portfolio-sections";

export default function ResumePage() {
  return (
    <main className="secondary-page">
      <a className="secondary-back" href="/">Back home</a>
      <ResumeSection />
      <PortfolioFooter />
    </main>
  );
}
