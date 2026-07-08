"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type FeedbackLanguage = "pt" | "en" | "es";

type FeedbackItem = {
  id: string;
  clientName: string;
  projectName: string;
  projectType: string;
  quote: string;
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
const DRAG_THRESHOLD = 40;

const FEEDBACK_COPY: Record<FeedbackLanguage, FeedbackCopy> = {
  pt: {
    ariaLabel: "Depoimentos e percepcoes de clientes",
    kicker: "FEEDBACKS",
    title: "O que clientes percebem quando a marca ganha presenca digital.",
    subtitle:
      "Comentarios e percepcoes de projetos criados para transformar marcas em experiencias digitais mais claras, memoraveis e profissionais.",
    proofLabel: "Comentarios de clientes",
    proofValue: "4 feedbacks de projetos Linka",
    orbitLabel: "Gire a orbita de depoimentos",
    previousLabel: "Depoimento anterior",
    nextLabel: "Proximo depoimento",
    cards: [
      {
        id: "baptista",
        clientName: "Cliente Linka",
        projectName: "Baptista",
        projectType: "Site de captacao",
        quote: "A presenca digital ficou mais clara, profissional e alinhada com o nivel da marca.",
      },
      {
        id: "nutricao",
        clientName: "Cliente Linka",
        projectName: "Nutricao",
        projectType: "Landing page de conversao",
        quote: "A pagina ficou objetiva, elegante e muito mais preparada para transformar visitas em contatos.",
      },
      {
        id: "casa-sea",
        clientName: "Cliente Linka",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "A experiencia visual ficou mais memoravel e transmitiu melhor a proposta do negocio.",
      },
      {
        id: "escobar",
        clientName: "Cliente Linka",
        projectName: "Escobar",
        projectType: "Site de conversao",
        quote: "A apresentacao da marca ficou mais solida, refinada e convincente para o publico certo.",
      },
    ],
  },
  en: {
    ariaLabel: "Client testimonials and project perceptions",
    kicker: "CLIENT FEEDBACKS",
    title: "What clients notice when a brand gets a stronger digital presence.",
    subtitle:
      "Comments and project perceptions from experiences designed to make brands clearer, more memorable, and more professional.",
    proofLabel: "Client comments",
    proofValue: "4 Linka project feedbacks",
    orbitLabel: "Rotate the testimonial orbit",
    previousLabel: "Previous testimonial",
    nextLabel: "Next testimonial",
    cards: [
      {
        id: "baptista",
        clientName: "Linka client",
        projectName: "Baptista",
        projectType: "Lead generation website",
        quote: "The digital presence became clearer, more professional, and aligned with the level of the brand.",
      },
      {
        id: "nutricao",
        clientName: "Linka client",
        projectName: "Nutrition",
        projectType: "Conversion landing page",
        quote: "The page became objective, elegant, and much better prepared to turn visits into contacts.",
      },
      {
        id: "casa-sea",
        clientName: "Linka client",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "The visual experience became more memorable and communicated the business proposal more clearly.",
      },
      {
        id: "escobar",
        clientName: "Linka client",
        projectName: "Escobar",
        projectType: "Conversion website",
        quote: "The brand presentation became more solid, refined, and convincing for the right audience.",
      },
    ],
  },
  es: {
    ariaLabel: "Testimonios y percepciones de clientes",
    kicker: "FEEDBACKS",
    title: "Lo que los clientes perciben cuando la marca gana presencia digital.",
    subtitle:
      "Comentarios y percepciones de proyectos creados para transformar marcas en experiencias digitales mas claras, memorables y profesionales.",
    proofLabel: "Comentarios de clientes",
    proofValue: "4 feedbacks de proyectos Linka",
    orbitLabel: "Gira la orbita de testimonios",
    previousLabel: "Testimonio anterior",
    nextLabel: "Siguiente testimonio",
    cards: [
      {
        id: "baptista",
        clientName: "Cliente Linka",
        projectName: "Baptista",
        projectType: "Sitio de captacion",
        quote: "La presencia digital quedo mas clara, profesional y alineada con el nivel de la marca.",
      },
      {
        id: "nutricao",
        clientName: "Cliente Linka",
        projectName: "Nutricion",
        projectType: "Landing page de conversion",
        quote: "La pagina quedo objetiva, elegante y mucho mas preparada para convertir visitas en contactos.",
      },
      {
        id: "casa-sea",
        clientName: "Cliente Linka",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "La experiencia visual quedo mas memorable y transmitio mejor la propuesta del negocio.",
      },
      {
        id: "escobar",
        clientName: "Cliente Linka",
        projectName: "Escobar",
        projectType: "Sitio de conversion",
        quote: "La presentacion de la marca quedo mas solida, refinada y convincente para el publico correcto.",
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

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

export default function FeedbackSection() {
  const [language, setLanguage] = useState<FeedbackLanguage>("en");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const copy = useMemo(() => FEEDBACK_COPY[language], [language]);
  const dragRef = useRef({ startX: 0, startY: 0, deltaX: 0, deltaY: 0, active: false });
  const suppressClickRef = useRef(false);

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

  const goToFeedback = (index: number) => {
    setActiveIndex(wrapIndex(index, copy.cards.length));
  };

  const goToPreviousFeedback = () => {
    setActiveIndex((current) => wrapIndex(current - 1, copy.cards.length));
  };

  const goToNextFeedback = () => {
    setActiveIndex((current) => wrapIndex(current + 1, copy.cards.length));
  };

  const handleCardPointerUp = (index: number) => {
    const { deltaX, deltaY } = dragRef.current;
    const isTap = Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8;
    if (isTap) {
      goToFeedback(index);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      active: true,
    };
    setIsDragging(false);
    setDragOffset(0);
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic pointer events used by browser tests may not have an active pointer capture target.
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    dragRef.current.deltaX = deltaX;
    dragRef.current.deltaY = deltaY;

    const isHorizontalDrag = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;
    if (!isHorizontalDrag) return;

    event.preventDefault();
    setIsDragging(true);
    setDragOffset(Math.max(-68, Math.min(68, deltaX)));
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    const { deltaX, deltaY } = dragRef.current;
    const shouldRotate = Math.abs(deltaX) > DRAG_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.15;

    if (shouldRotate) {
      suppressClickRef.current = true;
      if (deltaX < 0) {
        goToNextFeedback();
      } else {
        goToPreviousFeedback();
      }
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }

    dragRef.current.active = false;
    setIsDragging(false);
    setDragOffset(0);
    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Ignore release errors when the pointer was not captured by this element.
    }
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

          <div
            className={`lfb-orbit-stage${isDragging ? " is-dragging" : ""}`}
            onPointerCancel={finishDrag}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            style={{ "--lfb-drag-offset": `${dragOffset}px` } as CSSProperties}
          >
            {copy.cards.map((feedback, index) => {
              const slot = wrapIndex(index - activeIndex, copy.cards.length);
              const isActive = slot === 0;

              return (
                <button
                  aria-label={`${copy.orbitLabel}: ${feedback.projectName}`}
                  aria-pressed={isActive}
                  className={`lfb-testimonial-card lfb-orbit-slot-${slot}${isActive ? " is-active" : ""}`}
                  key={feedback.id}
                  onClick={() => {
                    if (suppressClickRef.current) return;
                    goToFeedback(index);
                  }}
                  onPointerUp={() => handleCardPointerUp(index)}
                  type="button"
                >
                  <span aria-hidden="true" className="lfb-testimonial-mark">
                    "
                  </span>
                  <p>{feedback.quote}</p>
                  <footer>
                    <strong>{feedback.clientName}</strong>
                    <span>
                      {feedback.projectName} | {feedback.projectType}
                    </span>
                  </footer>
                </button>
              );
            })}
          </div>

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
                  onClick={() => goToFeedback(index)}
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
