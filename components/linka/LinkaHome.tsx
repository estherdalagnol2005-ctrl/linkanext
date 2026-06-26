import Footer from "./Footer";
import GlobalBackground from "./GlobalBackground";
import Header from "./Header";
import Hero from "./Hero";
import LinkaSiteEffects from "./LinkaSiteEffects";
import PortfolioSection from "./PortfolioSection";
import PromoSection from "./PromoSection";
import TechStackStrip from "./TechStackStrip";
import TransitionCta from "./TransitionCta";

export default function LinkaHome() {
  return (
    <div className="linka-page">
      <GlobalBackground />
      <Header />
      <main className="linka-site-content">
        <Hero />
        <PortfolioSection />
        <TechStackStrip />
        <PromoSection />
        <TransitionCta />
      </main>
      <Footer />
      <LinkaSiteEffects />
    </div>
  );
}
