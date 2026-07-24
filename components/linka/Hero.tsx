import { LINKA_LOGO_URL } from "./constants";

export default function Hero() {
  return (
    <section className="linka-v10-hero" data-linka-hero="" id="home">
      <div className="lv10-shell">
        <div className="lv10-visual">
          <div className="lv10-stage">
            <svg
              aria-hidden="true"
              className="lv10-lines"
              preserveAspectRatio="none"
              viewBox="0 0 640 620"
            >
              <path className="lv10-path" d="M320 310 C220 210, 145 125, 76 88" />
              <path className="lv10-path white" d="M320 310 C430 205, 510 125, 568 88" />
              <path className="lv10-path blue" d="M320 310 C210 372, 138 458, 74 532" />
              <path className="lv10-path white" d="M320 310 C438 372, 512 458, 570 532" />
            </svg>

            <div className="lv10-core">
              <div className="lv10-ring ring-a" />
              <div className="lv10-ring ring-b" />
              <div className="lv10-ring ring-c" />
              <div className="lv10-glow" />
              <img
                alt="Linka"
                className="lv10-logo"
                decoding="async"
                fetchPriority="high"
                height={683}
                src={LINKA_LOGO_URL}
                width={1024}
              />
            </div>

            <span className="lv10-launch-star launch-sites">✦</span>
            <span className="lv10-launch-star launch-clientes">✧</span>
            <span className="lv10-launch-star launch-exp">✦</span>
            <span className="lv10-launch-star launch-sua">✧</span>

            <img
              alt="Sites Linka"
              className="lv10-img img-sites"
              decoding="async"
              height={341}
              loading="eager"
              src="/images/hero-web1.webp"
              width={512}
            />
            <img
              alt="Landing Page Linka"
              className="lv10-img img-clientes"
              decoding="async"
              height={341}
              loading="eager"
              src="/images/hero-web2.webp"
              width={512}
            />
            <img
              alt="Experiência Linka"
              className="lv10-img img-exp"
              decoding="async"
              height={341}
              loading="eager"
              src="/images/hero-web3.webp"
              width={512}
            />
            <img
              alt="Sua Marca Linka"
              className="lv10-img img-sua"
              decoding="async"
              height={341}
              loading="eager"
              src="/images/hero-web4.webp"
              width={512}
            />
          </div>
        </div>

        <div className="lv10-copy">
          <div className="lv10-kicker">
            <span />
            QUEM LINKA HOJE, CONECTA AMANHÃ
          </div>
          <h1>
            Transformamos sua marca em uma{" "}
            <strong>experiência digital para o cliente.</strong>
          </h1>
          <p>
            A Linka cria sites, landing pages e experiências online para sua marca aparecer com
            estilo, conectar com mais clareza e transformar visitantes em clientes.
          </p>
          <div className="lv10-actions">
            <a className="lv10-cta" href="#lead-form">
              <span className="lv10-cta-label">{"Agendar minha reuni\u00e3o"}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
