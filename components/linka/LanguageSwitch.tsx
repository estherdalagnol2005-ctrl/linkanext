export default function LanguageSwitch() {
  return (
    <button
      aria-label="Trocar idioma para inglês"
      className="linka-language-switch"
      title="Trocar idioma para inglês"
      type="button"
    >
      <span aria-hidden="true" className="lls-star">
        ✦
      </span>
      <span aria-hidden="true" className="lls-globe">
        🌐
      </span>
      <span className="lls-lang lls-pt is-active">PT</span>
      <span aria-hidden="true" className="lls-separator">
        /
      </span>
      <span className="lls-lang lls-en">EN</span>
    </button>
  );
}
