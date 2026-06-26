"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LeadFormModal from "./components/LeadFormModal";

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
  }
}

type LeadFormLanguage = "pt" | "en" | "es";

type FunctionalReferenceProps = {
  markup: string;
  scripts: string[];
  styles: string;
};

const LANGUAGE_STORAGE_KEY = "linka-language-v2";

const LEAD_FORM_CTA_SELECTOR = [
  "a.lhx-link",
  "a.lhx-completion-cta",
  "a.lp8-discount",
  "a.lp8-reward-cta",
  "a.lp8-main-cta",
  "a.lnt3-cta",
].join(", ");

function normalizeLeadFormLanguage(value: string | null | undefined): LeadFormLanguage {
  const normalizedValue = value?.toLowerCase();

  if (normalizedValue?.startsWith("pt")) return "pt";
  if (normalizedValue?.startsWith("en")) return "en";
  if (normalizedValue?.startsWith("es")) return "es";

  return "en";
}

function readCurrentLeadFormLanguage(): LeadFormLanguage {
  const currentLanguage = window.LINKA_I18N?.current?.();
  if (currentLanguage) return normalizeLeadFormLanguage(currentLanguage);

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) return normalizeLeadFormLanguage(storedLanguage);
  } catch {
    // Keep the same default as the site language bootstrap when storage is unavailable.
  }

  return normalizeLeadFormLanguage(document.documentElement.lang);
}

export default function FunctionalReference({
  markup,
  scripts,
  styles,
}: FunctionalReferenceProps) {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadFormLanguage, setLeadFormLanguage] = useState<LeadFormLanguage>("en");
  const leadFormOpenerRef = useRef<HTMLElement | null>(null);

  const closeLeadForm = useCallback(() => {
    setIsLeadFormOpen(false);
  }, []);

  useEffect(() => {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    const scriptCleanups = scripts
      .map((script, index) => {
        try {
          return Function(script)();
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (process.env.NODE_ENV !== "production") {
            console.error(`[Linka portfolio] Extracted script ${index + 1} failed: ${message}`, error);
          }
          return undefined;
        }
      })
      .filter((cleanup): cleanup is () => void => typeof cleanup === "function");

    const portfolioStage = document.querySelector<HTMLElement>(".linka-stage");

    const forwardReturnButtonClick = (event: MouseEvent) => {
      const button = portfolioStage?.querySelector<HTMLButtonElement>(
        ".linka-device-return.is-visible",
      );

      if (!button || event.target === button) return;

      const bounds = button.getBoundingClientRect();
      const isInsideButton =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (isInsideButton) {
        event.preventDefault();
        event.stopPropagation();
        button.click();
      }
    };

    portfolioStage?.addEventListener("click", forwardReturnButtonClick, true);

    return () => {
      portfolioStage?.removeEventListener("click", forwardReturnButtonClick, true);
      scriptCleanups.reverse().forEach((cleanup, index) => {
        try {
          cleanup();
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (process.env.NODE_ENV !== "production") {
            console.error(`[Linka portfolio] Extracted script cleanup ${index + 1} failed: ${message}`, error);
          }
        }
      });
    };
  }, [scripts]);

  useEffect(() => {
    const syncLeadFormLanguage = () => {
      setLeadFormLanguage(readCurrentLeadFormLanguage());
    };

    syncLeadFormLanguage();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) syncLeadFormLanguage();
    };

    const handleLanguageClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(".lls-lang[data-language]")) return;

      window.requestAnimationFrame(syncLeadFormLanguage);
    };

    const languageObserver = new MutationObserver(syncLeadFormLanguage);
    languageObserver.observe(document.documentElement, {
      attributeFilter: ["lang"],
      attributes: true,
    });

    window.addEventListener("storage", handleStorage);
    document.addEventListener("click", handleLanguageClick);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("click", handleLanguageClick);
      languageObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const openLeadFormFromCta = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const leadCta = target.closest<HTMLElement>(LEAD_FORM_CTA_SELECTOR);
      if (!leadCta) return;

      event.preventDefault();
      leadFormOpenerRef.current = leadCta;
      setIsLeadFormOpen(true);
    };

    document.addEventListener("click", openLeadFormFromCta, true);

    return () => {
      document.removeEventListener("click", openLeadFormFromCta, true);
    };
  }, []);

  useEffect(() => {
    if (isLeadFormOpen || !leadFormOpenerRef.current) return;

    const opener = leadFormOpenerRef.current;
    leadFormOpenerRef.current = null;

    window.requestAnimationFrame(() => {
      opener.focus({ preventScroll: true });
    });
  }, [isLeadFormOpen]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <LeadFormModal isOpen={isLeadFormOpen} language={leadFormLanguage} onClose={closeLeadForm} />
    </>
  );
}
