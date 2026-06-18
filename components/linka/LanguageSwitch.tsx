export default function LanguageSwitch() {
  return (
    <div
      aria-label="Choose language"
      className="linka-language-switch"
      data-language-switch=""
      title="Choose language"
    >
      <button
        aria-controls="linka-language-menu"
        aria-expanded="false"
        aria-haspopup="menu"
        aria-label="Choose language"
        className="lls-trigger"
        type="button"
      >
        <span aria-hidden="true" className="lls-globe">
          {"\u{1F310}"}
        </span>
        <span className="lls-current">EN</span>
        <span aria-hidden="true" className="lls-chevron">
          {"\u203A"}
        </span>
      </button>

      <div
        aria-label="Choose language"
        className="lls-menu"
        id="linka-language-menu"
        role="menu"
      >
        <button
          aria-checked="true"
          className="lls-lang lls-en is-active"
          data-language="en"
          role="menuitemradio"
          type="button"
        >
          <span className="lls-option-code">EN</span>
          <span className="lls-option-name">English</span>
        </button>
        <button
          aria-checked="false"
          className="lls-lang lls-pt"
          data-language="pt"
          role="menuitemradio"
          type="button"
        >
          <span className="lls-option-code">PT</span>
          <span className="lls-option-name">{"Portugu\u00eas"}</span>
        </button>
        <button
          aria-checked="false"
          className="lls-lang lls-es"
          data-language="es"
          role="menuitemradio"
          type="button"
        >
          <span className="lls-option-code">ES</span>
          <span className="lls-option-name">{"Espa\u00f1ol"}</span>
        </button>
      </div>
    </div>
  );
}
