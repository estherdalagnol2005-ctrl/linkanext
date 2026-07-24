import { LINKA_LOGO_URL } from "./constants";
import LanguageSwitch from "./LanguageSwitch";

export default function Header() {
  return (
    <header className="linka-header-v11" data-linka-header-v11="">
      <div className="lh11-shell">
        <a aria-label="Back to the top" className="lh11-brand" href="#home">
          <span className="lh11-logo-aura" />
          <span className="lh11-logo-orbit" />
          <span className="lh11-logo-dot" />
          <span className="lh11-logo-star star-a">✦</span>
          <span className="lh11-logo-star star-b">✧</span>
          <img alt="Linka" decoding="async" fetchPriority="high" src={LINKA_LOGO_URL} />
        </a>

        <LanguageSwitch />
      </div>
    </header>
  );
}
