"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type FeedbackLanguage = "pt" | "en" | "es";

type FeedbackItem = {
  id: string;
  clientName: string;
  projectName: string;
  projectType: string;
  quote: string;
  preview: string;
};

type FeedbackCopy = {
  ariaLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  orbitLabel: string;
  previousLabel: string;
  nextLabel: string;
  cards: FeedbackItem[];
};

const LANGUAGE_STORAGE_KEY = "linka-language-v2";
const DRAG_THRESHOLD = 40;

const FEEDBACK_COPY: Record<FeedbackLanguage, FeedbackCopy> = {
  pt: {
    ariaLabel: "Depoimentos de clientes",
    kicker: "DEPOIMENTOS",
    title: "Palavras gentis de clientes satisfeitos",
    subtitle: "Comentários reais de marcas que confiaram na Linka.",
    orbitLabel: "Gire a órbita de depoimentos",
    previousLabel: "Depoimento anterior",
    nextLabel: "Próximo depoimento",
    cards: [
      {
        id: "quatorze",
        clientName: "Quatorze Hair Spa",
        projectName: "Quatorze",
        projectType: "Landing page",
        quote:
          "Ficou bonito, moderno e muito organizado. É fácil de navegar e tem todas as informações que uma pessoa procura quando está conhecendo um salão. Acho que o site passa exatamente a imagem que queremos do Quatorze: profissional, acolhedor e de qualidade. Dá para ver o cuidado em cada detalhe. Fiquei muito feliz com o resultado. Parabéns!",
        preview: "Bonito, moderno e organizado.",
      },
      {
        id: "luis-paulo-curty",
        clientName: "Luís Paulo Curty",
        projectName: "Luís Paulo Curty",
        projectType: "Site",
        quote:
          "O site ficou incrível. Todos para quem eu enviei amaram, e vocês me ouviram até ficar exatamente da maneira que eu queria.",
        preview: "Exatamente do jeito que eu queria.",
      },
      {
        id: "casa-sea",
        clientName: "Casa Sea",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "Eu gostei muito do resultado. O site transmitiu a essência da Casa Sea e ficou muito elegante!",
        preview: "Transmitiu a essência da Casa Sea.",
      },
      {
        id: "nutri",
        clientName: "Nutrição",
        projectName: "Nutrição",
        projectType: "Landing page",
        quote:
          "O site ficou maravilhoso. Vocês foram atenciosos em cada detalhe, e fiquei muito satisfeita com o resultado!",
        preview: "Atenciosos em cada detalhe.",
      },
    ],
  },
  en: {
    ariaLabel: "Client testimonials",
    kicker: "TESTIMONIALS",
    title: "Kind words from satisfied clients",
    subtitle: "Real comments from brands that trusted Linka.",
    orbitLabel: "Rotate the testimonial orbit",
    previousLabel: "Previous testimonial",
    nextLabel: "Next testimonial",
    cards: [
      {
        id: "quatorze",
        clientName: "Quatorze Hair Spa",
        projectName: "Quatorze",
        projectType: "Landing page",
        quote:
          "It turned out beautiful, modern, and very organized. It is easy to navigate and has all the information someone looks for when getting to know a salon. I think the website communicates exactly the image we want for Quatorze: professional, welcoming, and high-quality. You can see the care in every detail. I was very happy with the result. Congratulations!",
        preview: "Beautiful, modern, and organized.",
      },
      {
        id: "luis-paulo-curty",
        clientName: "Luís Paulo Curty",
        projectName: "Luís Paulo Curty",
        projectType: "Website",
        quote:
          "The website turned out amazing. Everyone I sent it to loved it, and you listened to me until it was exactly the way I wanted.",
        preview: "Exactly the way I wanted.",
      },
      {
        id: "casa-sea",
        clientName: "Casa Sea",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "I really liked the result. The website captured the essence of Casa Sea and turned out very elegant!",
        preview: "Captured the essence of Casa Sea.",
      },
      {
        id: "nutri",
        clientName: "Nutrition",
        projectName: "Nutrition",
        projectType: "Landing page",
        quote:
          "The website turned out wonderful. You were attentive to every detail, and I was very satisfied with the result!",
        preview: "Attentive to every detail.",
      },
    ],
  },
  es: {
    ariaLabel: "Testimonios de clientes",
    kicker: "TESTIMONIOS",
    title: "Palabras de clientes satisfechos",
    subtitle: "Comentarios reales de marcas que confiaron en Linka.",
    orbitLabel: "Gira la órbita de testimonios",
    previousLabel: "Testimonio anterior",
    nextLabel: "Siguiente testimonio",
    cards: [
      {
        id: "quatorze",
        clientName: "Quatorze Hair Spa",
        projectName: "Quatorze",
        projectType: "Landing page",
        quote:
          "Quedó bonito, moderno y muy organizado. Es fácil de navegar y tiene toda la información que una persona busca cuando está conociendo un salón. Creo que el sitio transmite exactamente la imagen que queremos para Quatorze: profesional, acogedora y de calidad. Se nota el cuidado en cada detalle. Quedé muy feliz con el resultado. ¡Felicitaciones!",
        preview: "Bonito, moderno y organizado.",
      },
      {
        id: "luis-paulo-curty",
        clientName: "Luís Paulo Curty",
        projectName: "Luís Paulo Curty",
        projectType: "Sitio",
        quote:
          "El sitio quedó increíble. A todas las personas a quienes se lo envié les encantó, y ustedes me escucharon hasta que quedó exactamente como yo quería.",
        preview: "Exactamente como yo quería.",
      },
      {
        id: "casa-sea",
        clientName: "Casa Sea",
        projectName: "Casa Sea",
        projectType: "Landing page",
        quote: "Me gustó mucho el resultado. El sitio transmitió la esencia de Casa Sea y quedó muy elegante.",
        preview: "Transmitió la esencia de Casa Sea.",
      },
      {
        id: "nutri",
        clientName: "Nutrición",
        projectName: "Nutrición",
        projectType: "Landing page",
        quote:
          "El sitio quedó maravilloso. Fueron atentos en cada detalle y quedé muy satisfecha con el resultado.",
        preview: "Atentos en cada detalle.",
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
              const displayedQuote = isActive ? feedback.quote : feedback.preview;

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
                  <p>{displayedQuote}</p>
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
