const HERO_WHATSAPP_URL =
  "https://wa.me/5554996443484?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Linka%20e%20quero%20agendar%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20meu%20projeto.";

const HERO_PROJECTS = {
  mainDesktop: "https://linkadigital.online/wp-content/uploads/2026/06/casaseadesktop.mp4",
  mainMobile: "https://linkadigital.online/wp-content/uploads/2026/06/casasea.mp4",
  depthDesktop: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionistadesktopmp4.mp4",
};

export default function Hero() {
  return (
    <section className="linka-v12-hero" data-linka-hero="" id="home">
      <div className="lv12-backdrop" aria-hidden="true">
        <span className="lv12-light lv12-light-a" />
        <span className="lv12-light lv12-light-b" />
        <span className="lv12-line lv12-line-a" />
        <span className="lv12-line lv12-line-b" />
        <span className="lv12-noise" />
      </div>

      <div className="lv12-shell">
        <div className="lv12-copy">
          <p className="lv12-kicker">LINKA DIGITAL / PORTFOLIO DIGITAL</p>

          <h1 className="lv12-title">
            <span className="lv12-title-mask">
              <span className="lv12-title-line lv12-title-line-a">Sites que não passam</span>
            </span>
            {" "}
            <span className="lv12-title-mask">
              <span className="lv12-title-line lv12-title-line-b">despercebidos.</span>
            </span>
          </h1>

          <p className="lv12-body">
            Design, estratégia e tecnologia para transformar marcas em experiências digitais
            marcantes.
          </p>

          <nav className="lv12-actions" aria-label="Ações principais da hero">
            <a className="lv12-cta" href="#portfolio">
              <span className="lv12-cta-label">Conhecer projetos</span>
              <span aria-hidden="true">→</span>
            </a>

            <a className="lv12-link" href={HERO_WHATSAPP_URL} rel="noopener" target="_blank">
              <span className="lv12-link-label">Falar com a Linka</span>
              <span aria-hidden="true">→</span>
            </a>
          </nav>
        </div>

        <div className="lv12-showcase" aria-label="Projeto Casa Sea em destaque">
          <div className="lv12-depth-card" aria-hidden="true">
            <video
              className="lv12-video lv12-video-depth"
              data-src-desktop={HERO_PROJECTS.depthDesktop}
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>

          <figure className="lv12-project">
            <div className="lv12-project-screen">
              <div className="lv12-video-fallback" aria-hidden="true">
                <span>Casa Sea</span>
                <small>Imóveis de alto padrão</small>
              </div>
              <video
                aria-label="Projeto Casa Sea criado pela Linka"
                className="lv12-video lv12-video-main"
                data-src-desktop={HERO_PROJECTS.mainDesktop}
                data-src-mobile={HERO_PROJECTS.mainMobile}
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          </figure>

          <div className="lv12-meta" aria-hidden="true">
            <span className="lv12-index">01</span>
            <span className="lv12-meta-line" />
            <span className="lv12-project-type">Website / 2026</span>
          </div>
        </div>

        <div className="lv12-scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
