"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackLanguage = "pt" | "en" | "es";

type FeedbackItem = {
  id: string;
  clientName: string;
  projectName: string;
  projectType: string;
  quote: string;
  preview: string;
  highlight: string;
};

type FeedbackCopy = {
  ariaLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  proofLabel: string;
  proofValue: string;
  orbitLabel: string;
  previousLabel: string;
  nextLabel: string;
  cards: FeedbackItem[];
};

const LANGUAGE_STORAGE_KEY = "linka-language-v2";

const FEEDBACK_COPY: Record<FeedbackLanguage, FeedbackCopy> = {
  pt: {
    ariaLabel: "Depoimentos e percepcoes de clientes",
    kicker: "FEEDBACKS",
    title: "O que clientes percebem quando a marca ganha presenca digital.",
    subtitle:
      "Comentarios e percepcoes de projetos criados para transformar marcas em experiencias digitais mais claras, memoraveis e profissionais.",
    proofLabel: "Comentarios de clientes",
    proofValue: "4 feedbacks de projetos Linka",
    orbitLabel: "Selecione um depoimento",
    previousLabel: "Depoimento anterior",
    nextLabel: "Proximo depoimento",
    cards: [
      {
        id: "baptista",
        clientName: "Cliente Linka",
        projectName: "Baptista",
        projectType: "Site de captacao",
        quote: "A presenca digital ficou mais clara, profissional e alinhada com o nivel da marca.",
        preview: "Mais clareza e posicionamento",
        highlight: "Presenca mais profissional",
      },
      {
        id: "nutricao",
        clientName: "Cliente Linka",
        projectName: "Nutricao",
        projectType: "Landing page de conversao",
        quote: "A pagina ficou objetiva, elegante e muito mais preparada para transformar visitas em contatos.",
        preview: "Mais intencao de contato",
        highlight: "Landing page mais estrategica",
      },
      {
        id: "casa-sea",
        clientName: "Cliente Linka",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "A experiencia visual ficou mais memoravel e transmitiu melhor a proposta do negocio.",
        preview: "Experiencia mais memoravel",
        highlight: "Visual mais marcante",
      },
      {
        id: "escobar",
        clientName: "Cliente Linka",
        projectName: "Escobar",
        projectType: "Site de conversao",
        quote: "A apresentacao da marca ficou mais solida, refinada e convincente para o publico certo.",
        preview: "Mais percepcao de valor",
        highlight: "Marca mais premium",
      },
    ],
  },
  en: {
    ariaLabel: "Client feedback and project perceptions",
    kicker: "CLIENT FEEDBACKS",
    title: "What clients notice when a brand gets a stronger digital presence.",
    subtitle:
      "Comments and project perceptions from experiences designed to make brands clearer, more memorable, and more professional.",
    proofLabel: "Client comments",
    proofValue: "4 Linka project feedbacks",
    orbitLabel: "Select a testimonial",
    previousLabel: "Previous testimonial",
    nextLabel: "Next testimonial",
    cards: [
      {
        id: "baptista",
        clientName: "Linka client",
        projectName: "Baptista",
        projectType: "Lead generation website",
        quote: "The digital presence became clearer, more professional, and aligned with the level of the brand.",
        preview: "More clarity and positioning",
        highlight: "More professional presence",
      },
      {
        id: "nutricao",
        clientName: "Linka client",
        projectName: "Nutrition",
        projectType: "Conversion landing page",
        quote: "The page became objective, elegant, and much better prepared to turn visits into contacts.",
        preview: "More contact intent",
        highlight: "More strategic landing page",
      },
      {
        id: "casa-sea",
        clientName: "Linka client",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "The visual experience became more memorable and communicated the business proposal more clearly.",
        preview: "More memorable experience",
        highlight: "More distinctive visual presence",
      },
      {
        id: "escobar",
        clientName: "Linka client",
        projectName: "Escobar",
        projectType: "Conversion website",
        quote: "The brand presentation became more solid, refined, and convincing for the right audience.",
        preview: "More perceived value",
        highlight: "More premium brand presence",
      },
    ],
  },
  es: {
    ariaLabel: "Feedbacks y percepciones de clientes",
    kicker: "FEEDBACKS",
    title: "Lo que los clientes perciben cuando la marca gana presencia digital.",
    subtitle:
      "Comentarios y percepciones de proyectos creados para transformar marcas en experiencias digitales mas claras, memorables y profesionales.",
    proofLabel: "Comentarios de clientes",
    proofValue: "4 feedbacks de proyectos Linka",
    orbitLabel: "Selecciona un testimonio",
    previousLabel: "Testimonio anterior",
    nextLabel: "Siguiente testimonio",
    cards: [
      {
        id: "baptista",
        clientName: "Cliente Linka",
        projectName: "Baptista",
        projectType: "Sitio de captacion",
        quote: "La presencia digital quedo mas clara, profesional y alineada con el nivel de la marca.",
        preview: "Mas claridad y posicionamiento",
        highlight: "Presencia mas profesional",
      },
      {
        id: "nutricao",
        clientName: "Cliente Linka",
        projectName: "Nutricion",
        projectType: "Landing page de conversion",
        quote: "La pagina quedo objetiva, elegante y mucho mas preparada para convertir visitas en contactos.",
        preview: "Mas intencion de contacto",
        highlight: "Landing page mas estrategica",
      },
      {
        id: "casa-sea",
        clientName: "Cliente Linka",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "La experiencia visual quedo mas memorable y transmitio mejor la propuesta del negocio.",
        preview: "Experiencia mas memorable",
        highlight: "Visual mas distintivo",
      },
      {
        id: "escobar",
        clientName: "Cliente Linka",
        projectName: "Escobar",
        projectType: "Sitio de conversion",
        quote: "La presentacion de la marca quedo mas solida, refinada y convincente para el publico correcto.",
        preview: "Mas percepcion de valor",
        highlight: "Marca mas premium",
      },
    ],
  },
};

function normalizeLanguage(value: string | null | undefined): FeedbackLanguage {
  const next = value?.toLowerCase() ?? "";
  if (next.startsWith("pt")) return "pt";
  if (next.startsWith("es")) return "es";
  return "en";
}

function currentLanguage(): FeedbackLanguage {
  if (typeof window === "undefined") return "en";

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);
  } catch {
    // Ignore storage access errors and fall back to the document language.
  }

  return normalizeLanguage(document.documentElement.lang);
}

export default function FeedbackSection() {
  const [language, setLanguage] = useState<FeedbackLanguage>("en");
  const [activeIndex, setActiveIndex] = useState(0);
  const copy = useMemo(() => FEEDBACK_COPY[language], [language]);
  const activeFeedback = copy.cards[activeIndex] ?? copy.cards[0];

  useEffect(() => {
    const syncLanguage = () => setLanguage(currentLanguage());

    syncLanguage();

    const observer = new MutationObserver(syncLanguage);
    observer.observe(document.documentElement, { attributeFilter: ["lang"], attributes: true });

    const switcher = document.querySelector<HTMLElement>(".linka-language-switch");
    switcher?.addEventListener("click", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      observer.disconnect();
      switcher?.removeEventListener("click", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, copy.cards.length - 1));
  }, [copy.cards.length]);

  const goToPreviousFeedback = () => {
    setActiveIndex((current) => (current - 1 + copy.cards.length) % copy.cards.length);
  };

  const goToNextFeedback = () => {
    setActiveIndex((current) => (current + 1) % copy.cards.length);
  };

  return (
    <section aria-label={copy.ariaLabel} className="linka-feedbacks">
      <div aria-hidden="true" className="lfb-orbit-line" />
      <div aria-hidden="true" className="lfb-scanline" />

      <div className="lfb-shell">
        <div className="lfb-head">
          <span className="lfb-kicker">
            <i aria-hidden="true" />
            {copy.kicker}
          </span>

          <div className="lfb-title-block">
            <h2>{copy.title}</h2>
            <p>{copy.subtitle}</p>
          </div>

          <div className="lfb-proof" aria-label={copy.proofValue}>
            <span>{copy.proofLabel}</span>
            <strong>{copy.proofValue}</strong>
          </div>
        </div>

        <div aria-label={copy.orbitLabel} className="lfb-orbit" role="group">
          <div aria-hidden="true" className="lfb-orbit-ring" />
          <div aria-hidden="true" className="lfb-orbit-core" />

          <article className="lfb-active-card" key={`${language}-${activeFeedback.id}`}>
            <span aria-hidden="true" className="lfb-quote">
              "
            </span>

            <strong className="lfb-highlight">{activeFeedback.highlight}</strong>
            <p>{activeFeedback.quote}</p>

            <footer>
              <div>
                <strong>{activeFeedback.clientName}</strong>
                <span>
                  {activeFeedback.projectName} | {activeFeedback.projectType}
                </span>
              </div>
            </footer>
          </article>

          {copy.cards.map((feedback, index) => (
            <button
              aria-label={`${copy.orbitLabel}: ${feedback.projectName}`}
              aria-pressed={index === activeIndex}
              className={`lfb-orbit-card lfb-slot-${index + 1}${index === activeIndex ? " is-active" : ""}`}
              key={feedback.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <strong>{feedback.preview}</strong>
              <small>
                {feedback.projectName} | {feedback.projectType}
              </small>
            </button>
          ))}

          <div className="lfb-controls" aria-label={copy.orbitLabel}>
            <button aria-label={copy.previousLabel} onClick={goToPreviousFeedback} type="button">
              <span aria-hidden="true">{"<"}</span>
            </button>
            <div className="lfb-dots">
              {copy.cards.map((feedback, index) => (
                <button
                  aria-label={`${copy.orbitLabel}: ${feedback.projectName}`}
                  aria-pressed={index === activeIndex}
                  className={index === activeIndex ? "is-active" : ""}
                  key={`dot-${feedback.id}`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
            <button aria-label={copy.nextLabel} onClick={goToNextFeedback} type="button">
              <span aria-hidden="true">{">"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
