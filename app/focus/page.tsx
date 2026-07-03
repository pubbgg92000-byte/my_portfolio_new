import { CurrentFocusSection, LearningNowSection, PortfolioFooter } from "@/components/sections/portfolio-sections";

export default function FocusPage() {
  return (
    <main className="secondary-page">
      <a className="secondary-back" href="/">Back home</a>
      <LearningNowSection />
      <CurrentFocusSection />
      <PortfolioFooter />
    </main>
  );
}
