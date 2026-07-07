"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackLanguage = "pt" | "en" | "es";

type FeedbackItem = {
  id: string;
  name: string;
  project: string;
  tag: string;
  text: string;
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
    title: "O que muda quando a presenca digital parece profissional.",
    subtitle:
      "Feedbacks e percepcoes de projetos criados para transformar marcas em experiencias digitais mais memoraveis.",
    proofLabel: "Prova social em construcao",
    proofValue: "4 percepcoes de projetos digitais",
    orbitLabel: "Selecione um feedback",
    previousLabel: "Feedback anterior",
    nextLabel: "Proximo feedback",
    cards: [
      {
        id: "01",
        name: "Cliente Linka",
        project: "Site de captacao - Baptista",
        tag: "Clareza e posicionamento",
        text: "A presenca digital ficou muito mais profissional e transmitiu exatamente o nivel da marca.",
      },
      {
        id: "02",
        name: "Cliente Linka",
        project: "Landing page de conversao - Nutricionista",
        tag: "Conversao",
        text: "A pagina ficou mais objetiva, elegante e com muito mais potencial de transformar visitas em contatos.",
      },
      {
        id: "03",
        name: "Cliente Linka",
        project: "Landing page - Casa Sea",
        tag: "Experiencia",
        text: "A proposta visual ficou mais memoravel, alinhada e muito mais forte para apresentar o restaurante.",
      },
      {
        id: "04",
        name: "Cliente Linka",
        project: "Landing page - Escobar",
        tag: "Percepcao premium",
        text: "A marca passou a ter uma apresentacao mais solida, mais refinada e muito mais convincente.",
      },
    ],
  },
  en: {
    ariaLabel: "Client feedback and project perceptions",
    kicker: "FEEDBACKS",
    title: "What changes when your digital presence feels professional.",
    subtitle:
      "Feedback and project perceptions from experiences designed to make brands clearer, sharper, and more memorable.",
    proofLabel: "Social proof in progress",
    proofValue: "4 digital project perceptions",
    orbitLabel: "Select a feedback",
    previousLabel: "Previous feedback",
    nextLabel: "Next feedback",
    cards: [
      {
        id: "01",
        name: "Linka client",
        project: "Lead generation website - Baptista",
        tag: "Clarity and positioning",
        text: "The digital presence felt much more professional and communicated the exact level of the brand.",
      },
      {
        id: "02",
        name: "Linka client",
        project: "Conversion landing page - Nutritionist",
        tag: "Conversion",
        text: "The page became more objective, elegant, and much stronger at turning visits into conversations.",
      },
      {
        id: "03",
        name: "Linka client",
        project: "Landing page - Casa Sea",
        tag: "Experience",
        text: "The visual proposal became more memorable, aligned, and much stronger for presenting the restaurant.",
      },
      {
        id: "04",
        name: "Linka client",
        project: "Landing page - Escobar",
        tag: "Premium perception",
        text: "The brand gained a more solid, refined, and convincing digital presentation.",
      },
    ],
  },
  es: {
    ariaLabel: "Feedbacks y percepciones de clientes",
    kicker: "FEEDBACKS",
    title: "Lo que cambia cuando la presencia digital se ve profesional.",
    subtitle:
      "Feedbacks y percepciones de proyectos creados para transformar marcas en experiencias digitales mas memorables.",
    proofLabel: "Prueba social en construccion",
    proofValue: "4 percepciones de proyectos digitales",
    orbitLabel: "Selecciona un feedback",
    previousLabel: "Feedback anterior",
    nextLabel: "Siguiente feedback",
    cards: [
      {
        id: "01",
        name: "Cliente Linka",
        project: "Sitio de captacion - Baptista",
        tag: "Claridad y posicionamiento",
        text: "La presencia digital se sintio mucho mas profesional y transmitio exactamente el nivel de la marca.",
      },
      {
        id: "02",
        name: "Cliente Linka",
        project: "Landing page de conversion - Nutricionista",
        tag: "Conversion",
        text: "La pagina quedo mas objetiva, elegante y con mucho mas potencial para convertir visitas en contactos.",
      },
      {
        id: "03",
        name: "Cliente Linka",
        project: "Landing page - Casa Sea",
        tag: "Experiencia",
        text: "La propuesta visual quedo mas memorable, alineada y mucho mas fuerte para presentar el restaurante.",
      },
      {
        id: "04",
        name: "Cliente Linka",
        project: "Landing page - Escobar",
        tag: "Percepcion premium",
        text: "La marca paso a tener una presentacion mas solida, refinada y mucho mas convincente.",
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
            <span className="lfb-card-index">{activeFeedback.id}</span>
            <span aria-hidden="true" className="lfb-quote">
              "
            </span>

            <p>{activeFeedback.text}</p>

            <footer>
              <div>
                <strong>{activeFeedback.name}</strong>
                <span>{activeFeedback.project}</span>
              </div>
              <em className="lfb-tag">{activeFeedback.tag}</em>
            </footer>
          </article>

          {copy.cards.map((feedback, index) => (
            <button
              aria-label={`${copy.orbitLabel}: ${feedback.project}`}
              aria-pressed={index === activeIndex}
              className={`lfb-orbit-card lfb-slot-${index + 1}${index === activeIndex ? " is-active" : ""}`}
              key={feedback.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <span className="lfb-mini-index">{feedback.id}</span>
              <strong>{feedback.tag}</strong>
              <small>{feedback.project}</small>
            </button>
          ))}

          <div className="lfb-controls" aria-label={copy.orbitLabel}>
            <button aria-label={copy.previousLabel} onClick={goToPreviousFeedback} type="button">
              <span aria-hidden="true">‹</span>
            </button>
            <div className="lfb-dots">
              {copy.cards.map((feedback, index) => (
                <button
                  aria-label={`${copy.orbitLabel}: ${feedback.project}`}
                  aria-pressed={index === activeIndex}
                  className={index === activeIndex ? "is-active" : ""}
                  key={`dot-${feedback.id}`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
            <button aria-label={copy.nextLabel} onClick={goToNextFeedback} type="button">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
