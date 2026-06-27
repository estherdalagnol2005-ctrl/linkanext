const modules = [
  {
    index: "01",
    title: "ESTRATÉGIA",
    description: "Direção definida",
  },
  {
    index: "02",
    title: "IDENTIDADE",
    description: "A marca ganha forma",
  },
  {
    index: "03",
    title: "EXPERIÊNCIA",
    description: "Interações com propósito",
  },
  {
    index: "04",
    title: "CONVERSÃO",
    description: "Pronto para gerar resultado",
  },
];

export default function PortfolioBuildPrototype() {
  return (
    <section className="lpb-section" aria-label="Experiência em construção">
      <div className="lpb-shell">
        <div className="lpb-devices" aria-hidden="true">
          <div className="lpb-notebook">
            <div className="lpb-notebook-screen">
              <div className="lpb-window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="lpb-wireframe lpb-wireframe-hero" />
              <div className="lpb-wireframe-row">
                <span />
                <span />
                <span />
              </div>
              <div className="lpb-wireframe-grid">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="lpb-notebook-base" />
          </div>

          <div className="lpb-phone">
            <div className="lpb-phone-screen">
              <div className="lpb-phone-notch" />
              <div className="lpb-phone-line is-bright" />
              <div className="lpb-phone-block" />
              <div className="lpb-phone-line" />
              <div className="lpb-phone-line is-short" />
              <div className="lpb-phone-button" />
            </div>
          </div>
        </div>

        <div className="lpb-content">
          <div className="lpb-panel">
            <span className="lpb-eyebrow">EXPERIÊNCIA EM CONSTRUÇÃO</span>
            <strong className="lpb-status">4 / 4 módulos conectados</strong>
            <p>
              Cada camada transforma uma ideia
              <br />
              em uma experiência digital completa.
            </p>
            <div className="lpb-progress" aria-label="Progresso 100%">
              <span />
            </div>
          </div>

          <div className="lpb-modules" aria-label="Módulos conectados">
            {modules.map((module) => (
              <article className="lpb-module" key={module.index}>
                <span>{module.index}</span>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
