import type { CSSProperties } from "react";

import { WHATSAPP_ICON_URL, WHATSAPP_PROMO_URL } from "./constants";

export default function PromoSection() {
  return (
    <section
      className="linka-promo-v8"
      data-linka-promo=""
      data-unlock-step="0"
      id="pricing-grid"
      style={{ "--unlock-progress": 0 } as CSSProperties}
    >
      <div aria-hidden="true" className="lp8-bg" />
      <div className="lp8-shell">
        <div className="lp8-visual">
          <div className="lp8-benefit-card">
            <span aria-hidden="true" className="lp8-card-shine" />
            <div className="lp8-card-top">
              <span className="lp8-card-badge">BENEFÍCIO BLOQUEADO</span>
              <span aria-hidden="true" className="lp8-card-chip" />
            </div>

            <div className="lp8-card-main">
              <p className="lp8-card-title">Condição especial Linka</p>
              <strong className="lp8-value" aria-live="polite">
                <span className="lp8-value-locked">••% OFF</span>
                <span className="lp8-value-unlocked">25% OFF</span>
              </strong>
              <p className="lp8-unlocked-copy">Para criar seu Site ou Landing Page com a Linka.</p>
            </div>

            <div className="lp8-segments" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="lp8-unlock-area">
              <p className="lp8-unlock-status">ARRASTE PARA DESBLOQUEAR</p>
              <div className="lp8-unlock-track">
                <span aria-hidden="true" className="lp8-unlock-fill" />
                <button
                  aria-label="Arraste para desbloquear o benefício de 25% OFF"
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={0}
                  className="lp8-drag-key"
                  role="slider"
                  type="button"
                >
                  <span aria-hidden="true" className="lp8-key-mark" />
                </button>
              </div>
            </div>

            <a className="lp8-reward-cta" href={WHATSAPP_PROMO_URL} rel="noopener" target="_blank">
              RESGATAR MEU 25% OFF
            </a>
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
              <img alt="" src={WHATSAPP_ICON_URL} />
            </i>
          </a>
        </div>
      </div>
    </section>
  );
}
