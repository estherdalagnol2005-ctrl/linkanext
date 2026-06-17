export default function LanguageSwitch() {
  return (
    <div
      aria-label="Choose language"
      className="linka-language-switch"
      role="group"
      title="Choose language"
    >
      <span aria-hidden="true" className="lls-star">
        {"\u2726"}
      </span>
      <span aria-hidden="true" className="lls-globe">
        {"\u{1F310}"}
      </span>
      <button
        aria-label="English"
        aria-pressed="true"
        className="lls-lang lls-en is-active"
        data-language="en"
        type="button"
      >
        EN
      </button>
      <span aria-hidden="true" className="lls-separator">
        /
      </span>
      <button
        aria-label="Português"
        aria-pressed="false"
        className="lls-lang lls-pt"
        data-language="pt"
        type="button"
      >
        PT
      </button>
      <span aria-hidden="true" className="lls-separator">
        /
      </span>
      <button
        aria-label="Español"
        aria-pressed="false"
        className="lls-lang lls-es"
        data-language="es"
        type="button"
      >
        ES
      </button>
    </div>
  );
}
