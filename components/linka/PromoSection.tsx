import type { CSSProperties } from "react";

import {
  LINKA_PROMO_LOGO_URL,
  WHATSAPP_ICON_URL,
  WHATSAPP_PROMO_URL,
} from "./constants";

const burstAngles = ["0deg", "45deg", "90deg", "135deg", "180deg", "225deg", "270deg", "315deg"];

export default function PromoSection() {
  return (
    <section className="linka-promo-v8" data-linka-promo="" id="pricing-grid">
      <div aria-hidden="true" className="lp8-bg" />
      <div className="lp8-shell">
        <div className="lp8-visual">
          <div className="lp8-stage">
            <div className="lp8-core">
              <div className="lp8-sphere" />
              <div className="lp8-ring lp8-ring-a" />
              <div className="lp8-ring lp8-ring-b" />
              <div className="lp8-glow" />
              <img
                alt="Linka Aqui"
                className="lp8-logo"
                decoding="async"
                loading="lazy"
                src={LINKA_PROMO_LOGO_URL}
              />
              <button aria-label="Ativar núcleo Linka" className="lp8-core-btn" type="button" />
              <a className="lp8-discount" href={WHATSAPP_PROMO_URL} rel="noopener" target="_blank">
                <span>25%</span>
                <small>OFF liberado</small>
              </a>
              <div className="lp8-hint">
                Clique no <b>núcleo Linka</b>
                <br />e desbloqueie sua condição especial
              </div>
            </div>

            <div className="lp8-progress">
              <div className="lp8-progress-top">
                <span>Ativando presença digital...</span>
                <strong className="lp8-percent">0%</strong>
              </div>
              <div className="lp8-progress-track">
                <i className="lp8-progress-fill" />
              </div>
            </div>

            <div className="lp8-flash" />
            <div className="lp8-burst">
              {burstAngles.map((angle) => (
                <i key={angle} style={{ "--a": angle } as CSSProperties} />
              ))}
            </div>

            <div aria-hidden="true" className="lp8-reward">
              <button aria-label="Fechar desconto" className="lp8-close" type="button">
                ×
              </button>
              <div className="lp8-badge">Benefício exclusivo desbloqueado</div>
              <h3>
                Você liberou
                <strong>25% OFF</strong>
              </h3>
              <p>Para criar seu Site ou Landing Page com a Linka.</p>
              <a className="lp8-reward-cta" href={WHATSAPP_PROMO_URL} rel="noopener" target="_blank">
                Resgatar meu 25% OFF
              </a>
            </div>
          </div>
        </div>

        <div className="lp8-copy">
          <div className="lp8-kicker">
            <span />
            Promoção de lançamento
          </div>
          <h2>
            Aproveite nossa promoção especial.
            <strong>E gere alto valor para sua empresa.</strong>
          </h2>
          <p>
            Entre em contato agora com nosso suporte e tenha uma condição especial para iniciar seu
            projeto do jeito certo.
          </p>
          <a className="lp8-main-cta" href={WHATSAPP_PROMO_URL} rel="noopener" target="_blank">
            <span>Quero minha Linka</span>
            <i>
              <img alt="" decoding="async" loading="lazy" src={WHATSAPP_ICON_URL} />
            </i>
          </a>
        </div>
      </div>
    </section>
  );
}
