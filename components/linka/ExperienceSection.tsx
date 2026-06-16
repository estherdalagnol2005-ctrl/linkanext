const cards = [
  {
    icon: "✦",
    label: "CRIE VALOR DIGITAL",
    title: "Identidade Digital com Autoridade.",
    body:
      "A Linka cria sites e experiências digitais que fazem sua empresa ser vista com mais autoridade, mais confiança e mais valor pelos clientes certos.",
    tag: "Autoridade digital",
  },
  {
    icon: "✧",
    label: "TOQUE DE MÁGICA",
    title: "Sua marca será lembrada.",
    body:
      "Com a Linka, seu site se torna mais do que um site. Ele vira uma experiência online para encantar seu cliente e fortalecer sua marca.",
    tag: "Experiência premium",
  },
  {
    icon: "✦",
    label: "PRESENÇA QUE CONECTA",
    title: "Mais presença. Mais percepção.",
    body:
      "Uma presença digital bem construída transmite valor instantâneo, melhora sua imagem e aproxima sua empresa de clientes mais preparados para comprar.",
    tag: "Percepção de valor",
  },
];

export default function ExperienceSection() {
  return (
    <section className="linka-copy-v64" data-lov64="" id="portfolio">
      <div aria-hidden="true" className="lov64-star-stage">
        <div className="lov64-star">
          <span className="lov64-star-halo" />
          <span className="lov64-star-core">✦</span>
          <i className="lov64-firework fw-1" />
          <i className="lov64-firework fw-2" />
          <i className="lov64-firework fw-3" />
          <i className="lov64-firework fw-4" />
          <i className="lov64-firework fw-5" />
          <i className="lov64-firework fw-6" />
          <i className="lov64-firework fw-7" />
          <i className="lov64-firework fw-8" />
        </div>
      </div>

      <div className="lov64-shell">
        <div className="lov64-kicker">
          <span /> LINKA EXPERIENCE
        </div>
        <h2>
          <span>O toque de mágica</span>
          <strong>que sua empresa merece.</strong>
        </h2>
        <p className="lov64-lead">
          A Linka cria sites e experiências digitais com mais presença, mais clareza e mais valor
          percebido para a sua marca.
        </p>

        <div className="lov64-copy-layers">
          {cards.map((card) => (
            <div className="lov64-layer premium-card" key={card.title}>
              <span className="lov64-card-number" />
              <span className="lov64-card-icon">{card.icon}</span>
              <b>{card.label}</b>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <small>{card.tag}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
