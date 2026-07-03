import { CertificationsSection, PortfolioFooter } from "@/components/sections/portfolio-sections";

export default function CertificationsPage() {
  return (
    <main className="secondary-page">
      <a className="secondary-back" href="/">Back home</a>
      <CertificationsSection />
      <PortfolioFooter />
    </main>
  );
}
