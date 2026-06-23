import {
  LINKA_PRELOADER_LOGO_URL,
  LINKA_TRANSITION_LOGO_URL,
  WHATSAPP_ICON_URL,
  WHATSAPP_IDENTITY_URL,
} from "./constants";

export default function TransitionCta() {
  return (
    <section className="linka-nasa-transition-v3">
      <div aria-hidden="true" className="lnt3-field" />
      <div aria-hidden="true" className="lnt3-particles" />
      <div aria-hidden="true" className="lnt3-orbital-glow" />
      <div className="lnt3-content">
        <div className="lnt3-logo-wrap">
          <span className="lnt3-spark spark-a">✦</span>
          <span className="lnt3-spark spark-b">✧</span>
          <span className="lnt3-spark spark-c">✦</span>
          <picture style={{ display: "contents" }}>
            <source media="(min-width: 521px)" srcSet={LINKA_PRELOADER_LOGO_URL} />
            <img alt="Linka" decoding="async" loading="lazy" src={LINKA_TRANSITION_LOGO_URL} />
          </picture>
        </div>
        <p>Ser igual aos outros não é nossa ideologia. Faça sua marca ser lembrada com as criações da Linka.</p>
        <a className="lnt3-cta" href={WHATSAPP_IDENTITY_URL} rel="noopener" target="_blank">
          <span>WhatsApp da Linka</span>
          <i aria-hidden="true" className="lnt3-whats-icon">
            <img alt="" src={WHATSAPP_ICON_URL} />
          </i>
        </a>
      </div>
    </section>
  );
}
