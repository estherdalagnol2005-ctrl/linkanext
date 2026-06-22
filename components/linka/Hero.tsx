const HERO_WHATSAPP_URL =
  "https://wa.me/5554996443484?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Linka%20e%20quero%20agendar%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20meu%20projeto.";

export default function Hero() {
  return (
    <section className="linka-hero-experience" data-linka-hero="" id="home">
      <div className="lhx-color-field" aria-hidden="true">
        <span className="lhx-shape lhx-shape-purple" />
        <span className="lhx-shape lhx-shape-coral" />
        <span className="lhx-shape lhx-shape-green" />
      </div>

      <div className="lhx-scene">
        <div className="lhx-copy">
          <p className="lhx-kicker">DESIGN · ESTRATÉGIA · TECNOLOGIA</p>

          <h1 className="lhx-title">
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-a">Sites que transformam</span>
            </span>
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-b">marcas em</span>
            </span>
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-c">experiências.</span>
            </span>
          </h1>

          <p className="lhx-body">
            Criamos experiências digitais marcantes para negócios que não querem parecer iguais a
            todos os outros.
          </p>

          <div className="lhx-actions">
            <a className="lhx-cta" href="#portfolio">
              <span className="lhx-cta-label">Explorar projetos</span>
            </a>

            <a className="lhx-link" href={HERO_WHATSAPP_URL} rel="noopener" target="_blank">
              <span className="lhx-link-label">Iniciar um projeto</span>
              <span className="lhx-link-arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </div>
        </div>

        <div className="lhx-showcase" aria-label="Landing pages, sites e experiências digitais da Linka">
          <div className="lhx-type-tunnel" aria-hidden="true">
            <span className="lhx-type-layer lhx-type-layer-a">ROLE PARA EXPLORAR</span>
            <span className="lhx-type-layer lhx-type-layer-b">LANDING PAGES</span>
            <span className="lhx-type-layer lhx-type-layer-c">SITES QUE CONVERTEM</span>
          </div>

          <p className="lhx-depth-caption" aria-hidden="true">
            LANDING PAGES / SITES / EXPERIÊNCIAS DIGITAIS
          </p>
        </div>

        <div className="lhx-scroll-cue" aria-hidden="true">
          <span className="lhx-scroll-label">Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
