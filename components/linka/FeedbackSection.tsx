"use client";

import { useEffect, useMemo, useState } from "react";

type FeedbackLanguage = "pt" | "en" | "es";

type FeedbackItem = {
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
    cards: [
      {
        name: "Cliente Linka",
        project: "Site de captacao",
        tag: "Clareza e posicionamento",
        text: "A entrega ficou muito mais clara, profissional e alinhada com o posicionamento da marca.",
      },
      {
        name: "Cliente Linka",
        project: "Landing page",
        tag: "Conversao",
        text: "A pagina ficou objetiva, bonita e pensada para transformar visitantes em contatos reais.",
      },
      {
        name: "Cliente Linka",
        project: "Presenca digital",
        tag: "Experiencia digital",
        text: "O processo trouxe direcao visual, organizacao e uma experiencia muito mais premium para a marca.",
      },
      {
        name: "Cliente Linka",
        project: "Reposicionamento digital",
        tag: "Marca mais memoravel",
        text: "A comunicacao passou a parecer mais consistente, atual e facil de entender em todos os pontos de contato.",
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
    cards: [
      {
        name: "Linka client",
        project: "Lead generation website",
        tag: "Clarity and positioning",
        text: "The delivery felt clearer, more professional, and much more aligned with the brand's positioning.",
      },
      {
        name: "Linka client",
        project: "Landing page",
        tag: "Conversion",
        text: "The page became focused, polished, and built to turn visitors into real conversations.",
      },
      {
        name: "Linka client",
        project: "Digital presence",
        tag: "Digital experience",
        text: "The process brought visual direction, structure, and a more premium experience for the brand.",
      },
      {
        name: "Linka client",
        project: "Digital repositioning",
        tag: "More memorable brand",
        text: "The communication started to feel more consistent, current, and easier to understand across touchpoints.",
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
    cards: [
      {
        name: "Cliente Linka",
        project: "Sitio de captacion",
        tag: "Claridad y posicionamiento",
        text: "La entrega se sintio mucho mas clara, profesional y alineada con el posicionamiento de la marca.",
      },
      {
        name: "Cliente Linka",
        project: "Landing page",
        tag: "Conversion",
        text: "La pagina quedo objetiva, cuidada y pensada para convertir visitantes en contactos reales.",
      },
      {
        name: "Cliente Linka",
        project: "Presencia digital",
        tag: "Experiencia digital",
        text: "El proceso aporto direccion visual, organizacion y una experiencia mucho mas premium para la marca.",
      },
      {
        name: "Cliente Linka",
        project: "Reposicionamiento digital",
        tag: "Marca mas memorable",
        text: "La comunicacion paso a sentirse mas consistente, actual y facil de entender en cada punto de contacto.",
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
  const copy = useMemo(() => FEEDBACK_COPY[language], [language]);

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

  return (
    <section aria-label={copy.ariaLabel} className="linka-feedbacks">
      <div aria-hidden="true" className="lfb-orbit-line" />

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

        <div className="lfb-grid">
          {copy.cards.slice(0, 3).map((feedback, index) => (
            <article className={`lfb-card${index === 0 ? " is-featured" : ""}`} key={`${feedback.project}-${feedback.tag}`}>
              <span className="lfb-card-index">{String(index + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="lfb-quote">
                "
              </span>

              <p>{feedback.text}</p>

              <footer>
                <div>
                  <strong>{feedback.name}</strong>
                  <span>{feedback.project}</span>
                </div>
                <em className="lfb-tag">{feedback.tag}</em>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
