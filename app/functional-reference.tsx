"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function FunctionalReference({
  markup,
  scripts,
  styles,
}: FunctionalReferenceProps) {
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}
