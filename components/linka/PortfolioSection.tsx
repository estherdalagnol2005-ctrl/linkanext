import PortfolioReferencePage from "../../app/portfolio-reference-page";

export default function PortfolioSection() {
  return (
    <div className="linka-portfolio-mount" id="portfolio">
      <PortfolioReferencePage />
      <style>{`
        .linka-portfolio-mount {
          position: relative;
          z-index: 1;
          overflow: visible;
        }

        .linka-portfolio-mount .linka-hero {
          overflow: visible;
        }

        .linka-portfolio-mount .linka-stage.is-choice-menu {
          opacity: 1 !important;
          visibility: visible !important;
        }

        .linka-portfolio-mount
          .linka-stage.is-choice-menu:not(.is-project-open)
          .linka-card.is-choice-ready {
          visibility: visible !important;
        }

        .linka-portfolio-mount
          .linka-stage.is-project-open
          .linka-device-return.is-visible {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
}
