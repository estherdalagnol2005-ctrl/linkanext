"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import LeadFormModal from "../../app/components/LeadFormModal";

type LeadFormLanguage = "pt" | "en" | "es";

type LinkaI18nWindow = Window &
  typeof globalThis & {
    LINKA_I18N?: {
      current?: () => string;
    };
  };

const LANGUAGE_STORAGE_KEY = "linka-language-v2";

const LEAD_FORM_CTA_SELECTOR = [
  "a.lv10-cta",
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

  return "pt";
}

function readCurrentLeadFormLanguage(): LeadFormLanguage {
  const linkaWindow = window as LinkaI18nWindow;
  const currentLanguage = linkaWindow.LINKA_I18N?.current?.();
  if (currentLanguage) return normalizeLeadFormLanguage(currentLanguage);

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) return normalizeLeadFormLanguage(storedLanguage);
  } catch {
    // Keep the modal usable when storage is unavailable.
  }

  return normalizeLeadFormLanguage(document.documentElement.lang);
}

export default function LeadFormBridge() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadFormLanguage, setLeadFormLanguage] = useState<LeadFormLanguage>("pt");
  const leadFormOpenerRef = useRef<HTMLElement | null>(null);

  const closeLeadForm = useCallback(() => {
    setIsLeadFormOpen(false);
  }, []);

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
      setLeadFormLanguage(readCurrentLeadFormLanguage());
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
    <LeadFormModal
      isOpen={isLeadFormOpen}
      language={leadFormLanguage}
      onClose={closeLeadForm}
    />
  );
}
