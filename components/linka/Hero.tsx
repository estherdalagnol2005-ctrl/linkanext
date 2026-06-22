const HERO_WHATSAPP_URL =
  "https://wa.me/5554996443484?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Linka%20e%20quero%20agendar%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20meu%20projeto.";

export default function Hero() {
  return (
    <section className="linka-hero-experience" data-linka-hero="" id="home">
      <div className="lhx-scene">
        <div className="lhx-color-field" aria-hidden="true">
          <span className="lhx-shape lhx-shape-blue" />
          <span className="lhx-shape lhx-shape-arc" />
          <span className="lhx-shape lhx-shape-green" />
        </div>

        <div className="lhx-copy">
          <p className="lhx-kicker">DESIGN · ESTRATÉGIA · TECNOLOGIA</p>

          <h1 className="lhx-title">
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-a">Sites que marcam.</span>
            </span>
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-b">Landing pages que convertem.</span>
            </span>
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-c">
                <span className="lhx-title-line-c-copy">Experiências digitais que</span>{" "}
                <span className="lhx-title-em">conectam.</span>
              </span>
            </span>
          </h1>

          <p className="lhx-body">
            Criamos presença digital estratégica para transformar marcas em experiências que as
            pessoas lembram.
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

        <div className="lhx-showcase" aria-label="Serviços digitais da Linka">
          <div className="lhx-depth-indicator">
            <span className="lhx-depth-indicator-label">ROLE PARA DESCOBRIR</span>
            <i aria-hidden="true" />
          </div>

          <div className="lhx-type-tunnel">
            <article className="lhx-service-card lhx-service-card-sites">
              <span className="lhx-service-index" aria-hidden="true">01</span>
              <h2 className="lhx-service-title lhx-service-title-sites">SITES</h2>
              <p className="lhx-service-copy lhx-service-copy-sites">
                Presença digital que posiciona, diferencia e fortalece sua marca.
              </p>
            </article>

            <article className="lhx-service-card lhx-service-card-landings">
              <span className="lhx-service-index" aria-hidden="true">02</span>
              <h2 className="lhx-service-title lhx-service-title-landings">LANDING PAGES</h2>
              <p className="lhx-service-copy lhx-service-copy-landings">
                Páginas estratégicas criadas para apresentar, envolver e converter.
              </p>
            </article>

            <article className="lhx-service-card lhx-service-card-experiences">
              <span className="lhx-service-index" aria-hidden="true">03</span>
              <h2 className="lhx-service-title lhx-service-title-experiences">EXPERIÊNCIAS DIGITAIS</h2>
              <p className="lhx-service-copy lhx-service-copy-experiences">
                Interações marcantes que aproximam marcas e pessoas.
              </p>
            </article>

            <article className="lhx-service-card lhx-service-card-bio">
              <span className="lhx-service-index" aria-hidden="true">04</span>
              <h2 className="lhx-service-title lhx-service-title-bio">LINK NA BIO</h2>
              <p className="lhx-service-copy lhx-service-copy-bio">
                Todos os seus links em uma página única, estratégica e personalizada.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
