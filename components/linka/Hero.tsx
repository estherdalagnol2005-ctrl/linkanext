const HERO_WHATSAPP_URL =
  "https://wa.me/5554996443484?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Linka%20e%20quero%20agendar%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20meu%20projeto.";

const HERO_PROJECTS = {
  main: "https://linkadigital.online/wp-content/uploads/2026/06/web1.webp",
  secondary: "https://linkadigital.online/wp-content/uploads/2026/06/web2.webp",
  phone: "https://linkadigital.online/wp-content/uploads/2026/06/web3-1.webp",
  detail: "https://linkadigital.online/wp-content/uploads/2026/06/web4.webp",
};

export default function Hero() {
  return (
    <section className="linka-v10-hero" data-linka-hero="" id="home">
      <div className="lv10-background" aria-hidden="true">
        <span className="lv10-ambient ambient-a" />
        <span className="lv10-ambient ambient-b" />
        <span className="lv10-gridline gridline-a" />
        <span className="lv10-gridline gridline-b" />
        <span className="lv10-orbit-line orbit-line-a" />
        <span className="lv10-orbit-line orbit-line-b" />
        <span className="lv10-noise" />
      </div>

      <div className="lv10-shell">
        <div className="lv10-copy">
          <div className="lv10-kicker">
            <span className="lv10-kicker-dot" aria-hidden="true" />
            <span className="lv10-kicker-label">LINKA DIGITAL — EXPERIÊNCIAS DIGITAIS</span>
          </div>

          <h1 className="lv10-title">
            <span className="lv10-title-mask">
              <span className="lv10-title-line lv10-title-line-main">Sites que não passam</span>
            </span>
            {" "}
            <span className="lv10-title-mask">
              <span className="lv10-title-line lv10-title-line-accent">despercebidos.</span>
            </span>
          </h1>

          <p>
            Design, estratégia e tecnologia para transformar marcas em experiências digitais
            marcantes.
          </p>

          <div className="lv10-actions">
            <a className="lv10-cta" href="#portfolio">
              <span className="lv10-cta-label">Conhecer projetos</span>
              <span className="lv10-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>

            <a className="lv10-link" href={HERO_WHATSAPP_URL} rel="noopener" target="_blank">
              <span className="lv10-link-label">Falar com a Linka</span>
              <span className="lv10-link-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="lv10-visual" aria-label="Projetos digitais criados pela Linka">
          <div className="lv10-stage">
            <div className="lv10-radial" aria-hidden="true" />

            <figure className="lv10-device lv10-device-secondary">
              <div className="lv10-device-top" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="lv10-screen">
                <img
                  alt="Projeto Linka em tela secundária"
                  className="lv10-project-image"
                  decoding="async"
                  height="540"
                  loading="eager"
                  src={HERO_PROJECTS.secondary}
                  width="760"
                />
              </div>
            </figure>

            <figure className="lv10-device lv10-device-main">
              <div className="lv10-device-top" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="lv10-screen">
                <img
                  alt="Projeto principal de site moderno criado pela Linka"
                  className="lv10-project-image"
                  decoding="async"
                  fetchPriority="high"
                  height="620"
                  loading="eager"
                  src={HERO_PROJECTS.main}
                  width="900"
                />
              </div>
            </figure>

            <figure className="lv10-phone">
              <div className="lv10-phone-notch" aria-hidden="true" />
              <div className="lv10-phone-screen">
                <img
                  alt="Versão mobile de projeto digital da Linka"
                  className="lv10-project-image"
                  decoding="async"
                  height="640"
                  loading="lazy"
                  src={HERO_PROJECTS.phone}
                  width="360"
                />
              </div>
            </figure>

            <div className="lv10-project-chip chip-a" aria-hidden="true">
              <span>Design estratégico</span>
            </div>
            <div className="lv10-project-chip chip-b" aria-hidden="true">
              <img
                alt=""
                className="lv10-chip-image"
                decoding="async"
                height="112"
                loading="lazy"
                src={HERO_PROJECTS.detail}
                width="156"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lv10-scroll-indicator" aria-hidden="true">
        <span>SCROLL</span>
        <i />
      </div>
    </section>
  );
}
