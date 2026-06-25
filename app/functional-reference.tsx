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

type FunctionalReferenceProps = {
  markup: string;
  scripts: string[];
  styles: string;
};

const LEAD_FORM_CTA_SELECTOR = [
  "a.lhx-link",
  "a.lhx-completion-cta",
  "a.lp8-discount",
  "a.lp8-reward-cta",
  "a.lp8-main-cta",
  "a.lnt3-cta",
].join(", ");

export default function FunctionalReference({
  markup,
  scripts,
  styles,
}: FunctionalReferenceProps) {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const leadFormOpenerRef = useRef<HTMLElement | null>(null);

  const closeLeadForm = useCallback(() => {
    setIsLeadFormOpen(false);
  }, []);

  useEffect(() => {
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    const scriptCleanups = scripts
      .map((script) => Function(script)())
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
      scriptCleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [scripts]);

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
      <LeadFormModal isOpen={isLeadFormOpen} onClose={closeLeadForm} />
    </>
  );
}
