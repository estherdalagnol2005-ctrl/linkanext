const HERO_WHATSAPP_URL =
  "https://wa.me/5554996443484?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Linka%20e%20quero%20agendar%20uma%20reuni%C3%A3o%20para%20conversar%20sobre%20meu%20projeto.";

const services = [
  { key: "sites", code: "WEB", title: "SITES" },
  { key: "landings", code: "CVR", title: "LANDING PAGES" },
  { key: "experiences", code: "EXP", title: "EXPERIÊNCIAS DIGITAIS" },
  { key: "bio", code: "LNK", title: "LINK NA BIO" },
] as const;

export default function Hero() {
  return (
    <section className="linka-hero-experience" data-linka-hero="" id="home">
      <div className="lhx-scene">
        <div className="lhx-game-field" aria-hidden="true">
          <span className="lhx-field-plane lhx-field-plane-blue" />
          <span className="lhx-field-plane lhx-field-plane-violet" />
          <span className="lhx-field-signal" />
        </div>

        <div className="lhx-copy">
          <p className="lhx-kicker">DESIGN · ESTRATÉGIA · TECNOLOGIA</p>

          <h1 className="lhx-title">
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-a">Sites que se destacam.</span>
            </span>
            <span className="lhx-title-mask">
              <span className="lhx-title-line lhx-title-line-b">Landing pages que convertem.</span>
            </span>
            <span className="lhx-title-mask" hidden>
              <span className="lhx-title-line lhx-title-line-c">
                <span className="lhx-title-line-c-copy" /> <span className="lhx-title-em" />
              </span>
            </span>
          </h1>

          <p className="lhx-body">
            Criamos experiências digitais estratégicas para marcas que querem crescer, se diferenciar e ser lembradas.
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
          <div className="lhx-portal">
            <span className="lhx-portal-kicker" aria-hidden="true">UNLOCK THE STACK</span>
            <p className="lhx-card-title">
              <span className="lhx-card-title-mask">
                <span className="lhx-card-title-text">O que a Linka faz</span>
              </span>
              <span className="lhx-card-cursor" aria-hidden="true" />
            </p>
            <div className="lhx-scroll-invite">
              <span className="lhx-card-hint">ROLE PARA DESBLOQUEAR</span>
              <span className="lhx-scroll-copy">Uma nova criação está esperando.</span>
              <span className="lhx-scroll-motion" aria-hidden="true">
                <i className="lhx-scroll-line"><b /></i>
                <i className="lhx-scroll-chevron lhx-scroll-chevron-a" />
                <i className="lhx-scroll-chevron lhx-scroll-chevron-b" />
              </span>
            </div>
          </div>

          <div className="lhx-collection" aria-hidden="true">
            <span className="lhx-collection-label">COLLECTION</span>
            <div className="lhx-slot lhx-slot-a"><i /><span /></div>
            <div className="lhx-slot lhx-slot-b"><i /><span /></div>
            <div className="lhx-slot lhx-slot-c"><i /><span /></div>
            <div className="lhx-slot lhx-slot-d"><i /><span /></div>
          </div>

          <div className="lhx-energy-track" aria-hidden="true">
            <span className="lhx-track-segment lhx-track-segment-a" />
            <span className="lhx-track-node lhx-track-node-a" />
            <span className="lhx-track-segment lhx-track-segment-b" />
            <span className="lhx-track-node lhx-track-node-b" />
            <span className="lhx-track-segment lhx-track-segment-c" />
            <span className="lhx-track-node lhx-track-node-c" />
            <span className="lhx-track-segment lhx-track-segment-d" />
            <span className="lhx-track-node lhx-track-node-d" />
          </div>

          <div className="lhx-card-stage">
            {services.map(({ code, key, title }) => (
              <article className={`lhx-service-card lhx-service-card-${key}`} key={key}>
                <span className="lhx-card-code" aria-hidden="true">{code}</span>
                <span className="lhx-card-mark" aria-hidden="true"><i /></span>
                <span className="lhx-lock-state">
                  <i aria-hidden="true" />
                  <span className="lhx-lock-label">BLOQUEADO</span>
                </span>
                <h2 className={`lhx-service-title lhx-service-title-${key}`}>{title}</h2>
                <span className="lhx-card-energy" aria-hidden="true" />
                <span className="lhx-unlock-badge">DESBLOQUEADO</span>
                <span className="lhx-card-corner lhx-card-corner-a" aria-hidden="true" />
                <span className="lhx-card-corner lhx-card-corner-b" aria-hidden="true" />
              </article>
            ))}
          </div>

          <div className="lhx-reward-aura" aria-hidden="true">
            <span className="lhx-reward-shine" />
          </div>

          <div className="lhx-completion">
            <span className="lhx-completion-signal" aria-hidden="true"><i /></span>
            <p className="lhx-completion-title">Sua coleção está completa.</p>
            <p className="lhx-completion-copy">Agora é hora de criar uma experiência só sua.</p>
            <a className="lhx-completion-cta" href={HERO_WHATSAPP_URL} rel="noopener" target="_blank">
              <span className="lhx-completion-cta-label">Criar meu projeto</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
