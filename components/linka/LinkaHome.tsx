import Footer from "./Footer";
import FeedbackSection from "./FeedbackSection";
import GlobalBackground from "./GlobalBackground";
import Header from "./Header";
import Hero from "./Hero";
import LinkaSiteEffects from "./LinkaSiteEffects";
import PortfolioSection from "./PortfolioSection";
import Preloader from "./Preloader";
import PromoSection from "./PromoSection";
import TechStackStrip from "./TechStackStrip";
import TransitionCta from "./TransitionCta";

export default function LinkaHome() {
  return (
    <div className="linka-page">
      <Preloader />
      <GlobalBackground />
      <Header />
      <main className="linka-site-content">
        <Hero />
        <PortfolioSection />
        <FeedbackSection />
        <TechStackStrip />
        <PromoSection />
        <TransitionCta />
      </main>
      <Footer />
      <LinkaSiteEffects />
    </div>
  );
}
