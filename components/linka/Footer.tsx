import { LINKA_LOGO_URL, WHATSAPP_CONTACT_URL } from "./constants";

export default function Footer() {
  return (
    <footer className="linka-footer-v4">
      <div className="lf4-shell">
        <div className="lf4-main">
          <div className="lf4-brand">
            <img
              alt="Linka"
              className="lf4-logo"
              decoding="async"
              loading="lazy"
              src={LINKA_LOGO_URL}
            />
            <p>
              Quebre o padrão. Construa uma presença digital com sofisticação e estilo junto com a
              Linka.
            </p>
          </div>
          <div className="lf4-contact">
            <h3>Contato</h3>
            <a className="lf4-whatsapp" href={WHATSAPP_CONTACT_URL} rel="noopener" target="_blank">
              WhatsApp
            </a>
            <a href="#" rel="noopener" target="_blank">
              Instagram
            </a>
          </div>
        </div>
        <div className="lf4-bottom">
          <span>© 2026 Linka Studio. Todos os direitos reservados.</span>
          <span>Conexões digitais com mais clareza, valor e presença.</span>
        </div>
      </div>
    </footer>
  );
}
