"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LINKA_LOGO_URL } from "./constants";

declare global {
  interface Window {
    __LINKA_PRELOADER_DONE__?: boolean;
  }
}

const MIN_DURATION = 650;
const MAX_DURATION = 1500;
const MAX_RESOURCE_WAIT = 1120;
const PRELOADER_DONE_EVENT = "linka:preloader:done";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const timer = window.setTimeout(finish, ms);

    function finish() {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", finish);
      resolve();
    }

    signal?.addEventListener("abort", finish, { once: true });
  });
}

async function decodeImage(image: HTMLImageElement, signal?: AbortSignal) {
  if (!image.complete) {
    await new Promise<void>((resolve) => {
      if (signal?.aborted) {
        resolve();
        return;
      }

      const finish = () => resolve();
      const cleanup = () => {
        image.removeEventListener("load", handleFinish);
        image.removeEventListener("error", handleFinish);
        signal?.removeEventListener("abort", handleFinish);
      };
      const handleFinish = () => {
        cleanup();
        finish();
      };

      image.addEventListener("load", handleFinish, { once: true });
      image.addEventListener("error", handleFinish, { once: true });
      signal?.addEventListener("abort", handleFinish, { once: true });
    });
  }

  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  }
}

function decodeLogo(signal?: AbortSignal) {
  const logo = new Image();
  logo.decoding = "async";
  logo.src = LINKA_LOGO_URL;
  return decodeImage(logo, signal);
}

function decodeHeroImages(signal?: AbortSignal) {
  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>(".linka-header-v11 img, .linka-v10-hero img"),
  );

  return Promise.all(images.map((image) => decodeImage(image, signal))).then(() => undefined);
}

function waitForMainScripts(signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    const startedAt = performance.now();
    let frame = 0;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      if (frame) window.cancelAnimationFrame(frame);
      signal?.removeEventListener("abort", finish);
      resolve();
    };

    const check = () => {
      if (signal?.aborted) {
        finish();
        return;
      }

      if (window.gsap && window.ScrollTrigger && window.LINKA_I18N) {
        finish();
        return;
      }

      if (performance.now() - startedAt > 2200) {
        finish();
        return;
      }

      frame = window.requestAnimationFrame(check);
    };

    signal?.addEventListener("abort", finish, { once: true });
    check();
  });
}

function waitForFonts() {
  return document.fonts?.ready.then(() => undefined).catch(() => undefined) ?? Promise.resolve();
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(() =>
    typeof window === "undefined" ? true : window.__LINKA_PRELOADER_DONE__ !== true,
  );
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const progressTargetRef = useRef(0);
  const displayedProgressRef = useRef(0);
  const completeProgressRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.__LINKA_PRELOADER_DONE__) {
      document.body.classList.remove("linka-preload-lock");
      setIsVisible(false);
      return;
    }

    let cancelled = false;
    let progressFrame = 0;
    let finishTimer = 0;
    const abortController = new AbortController();
    const { signal } = abortController;

    document.body.classList.add("linka-preload-lock");

    const animateProgress = () => {
      const target = progressTargetRef.current;
      const current = displayedProgressRef.current;
      const distance = target - current;
      const next = distance <= 0.18 ? target : current + Math.max(distance * 0.085, 0.08);

      displayedProgressRef.current = next;
      setProgress(Math.min(100, Math.round(next)));

      if (target === 100 && next >= 99.6) {
        displayedProgressRef.current = 100;
        setProgress(100);
        completeProgressRef.current?.();
        completeProgressRef.current = null;
      }

      if (!cancelled) progressFrame = window.requestAnimationFrame(animateProgress);
    };

    progressFrame = window.requestAnimationFrame(animateProgress);

    const waitForDisplayedProgress = () =>
      new Promise<void>((resolve) => {
        if (displayedProgressRef.current >= 99.6) {
          resolve();
          return;
        }

        completeProgressRef.current = resolve;
      });

    const revealPage = async () => {
      document.body.classList.remove("linka-preload-lock");
      document.body.classList.add("linka-preloaded");

      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          resolve();
        });
      });

      const root = rootRef.current;
      const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      if (root) {
        await new Promise<void>((resolve) => {
          if (reducedMotion) {
            gsap.to(root, {
              autoAlpha: 0,
              duration: 0.14,
              ease: "power1.out",
              onComplete: resolve,
            });
            return;
          }

          const content = root.querySelector(".linka-preloader-content");
          const timeline = gsap.timeline({ onComplete: resolve });

          if (content) {
            timeline.to(
              content,
              {
                autoAlpha: 0,
                y: -10,
                scale: 0.985,
                filter: "blur(6px)",
                duration: 0.24,
                ease: "power3.inOut",
              },
              0,
            );
          }

          timeline.to(
            root,
            {
              autoAlpha: 0,
              scale: 1.01,
              filter: "blur(8px)",
              duration: 0.28,
              ease: "power3.inOut",
            },
            0.02,
          );
        });
      }

      window.__LINKA_PRELOADER_DONE__ = true;
      setIsVisible(false);
      if (root?.parentElement) root.remove();

      window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
        ScrollTrigger.refresh(true);
      });
    };

    const run = async () => {
      let completed = 0;
      const resources = [
        waitForFonts(),
        decodeLogo(signal),
        decodeHeroImages(signal),
        waitForMainScripts(signal),
        wait(MIN_DURATION, signal),
      ];

      const track = (resource: Promise<void>) =>
        resource
          .catch(() => undefined)
          .then(() => {
            completed += 1;
            progressTargetRef.current = Math.max(progressTargetRef.current, (completed / resources.length) * 92);
          });

      const allCriticalResources = Promise.all(resources.map(track));
      await Promise.race([allCriticalResources, wait(MAX_RESOURCE_WAIT, signal)]);

      if (cancelled) return;

      progressTargetRef.current = 100;
      displayedProgressRef.current = 100;
      setProgress(100);
      completeProgressRef.current?.();
      completeProgressRef.current = null;
      await waitForDisplayedProgress();
      if (!cancelled) {
        await revealPage();
        window.clearTimeout(finishTimer);
      }
    };

    finishTimer = window.setTimeout(() => {
      displayedProgressRef.current = 100;
      progressTargetRef.current = 100;
      setProgress(100);
      completeProgressRef.current?.();
      completeProgressRef.current = null;
    }, MAX_DURATION);

    run();

    return () => {
      cancelled = true;
      abortController.abort();
      window.cancelAnimationFrame(progressFrame);
      window.clearTimeout(finishTimer);
      completeProgressRef.current = null;
      const root = rootRef.current;
      if (root) {
        gsap.killTweensOf(root);
        const content = root.querySelector(".linka-preloader-content");
        if (content) gsap.killTweensOf(content);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={rootRef}
      aria-label="Carregando experiencia Linka"
      aria-live="polite"
      className="linka-preloader"
      role="status"
    >
      <div className="linka-preloader-bg" aria-hidden="true">
        <span className="linka-preloader-glow linka-preloader-glow-a" />
        <span className="linka-preloader-glow linka-preloader-glow-b" />
        <span className="linka-preloader-orbit" />
      </div>

      <div className="linka-preloader-content">
        <span className="linka-preloader-star" aria-hidden="true">
          *
        </span>
        <img alt="Linka" className="linka-preloader-logo" decoding="async" src={LINKA_LOGO_URL} />
        <div className="linka-preloader-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <span className="linka-preloader-percent">{progress}%</span>
      </div>
    </div>
  );
}
