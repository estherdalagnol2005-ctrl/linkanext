import { LINKA_LOGO_URL } from "./constants";
import LanguageSwitch from "./LanguageSwitch";

export default function Header() {
  return (
    <header className="linka-header-v11" data-linka-header-v11="">
      <div className="lh11-shell">
        <a aria-label="Back to the top" className="lh11-brand" href="#home">
          <img alt="Linka" src={LINKA_LOGO_URL} />
        </a>

        <span className="lh11-status-dot" aria-hidden="true" />
        <LanguageSwitch />
      </div>
    </header>
  );
}
