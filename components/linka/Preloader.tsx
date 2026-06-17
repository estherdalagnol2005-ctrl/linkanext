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

const MIN_DURATION = 1200;
const MAX_DURATION = 6000;
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

function waitForInitialVideoFrame(signal?: AbortSignal) {
  const video = document.querySelector<HTMLVideoElement>(".linka-main-video");
  if (!video || video.readyState >= 2) return Promise.resolve();

  const source = video.currentSrc || video.getAttribute("src") || video.getAttribute("data-src");
  if (!source) return Promise.resolve();

  video.preload = "auto";
  video.setAttribute("preload", "auto");
  if (!video.getAttribute("src")) video.setAttribute("src", source);

  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      video.removeEventListener("error", finish);
      signal?.removeEventListener("abort", finish);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, 4200);

    video.addEventListener("loadeddata", finish);
    video.addEventListener("canplay", finish);
    video.addEventListener("error", finish);
    signal?.addEventListener("abort", finish, { once: true });
    video.load();
  });
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
    let revealFallbackTimer = 0;
    let revealFrame = 0;
    let refreshFrame = 0;
    let didFinishReveal = false;
    const abortController = new AbortController();
    const { signal } = abortController;

    document.body.classList.add("linka-preload-lock");

    const finishReveal = () => {
      if (didFinishReveal) return;
      didFinishReveal = true;
      cancelled = true;

      window.clearTimeout(revealFallbackTimer);
      window.cancelAnimationFrame(progressFrame);
      completeProgressRef.current = null;
      document.body.classList.remove("linka-preload-lock");
      document.body.classList.add("linka-preloaded");

      const root = rootRef.current;
      if (root) {
        root.style.opacity = "0";
        root.style.visibility = "hidden";
        root.style.pointerEvents = "none";
      }

      window.__LINKA_PRELOADER_DONE__ = true;
      setIsVisible(false);

      revealFrame = window.requestAnimationFrame(() => {
        refreshFrame = window.requestAnimationFrame(() => {
          window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
          ScrollTrigger.refresh(true);
        });
      });
    };

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
      const root = rootRef.current;
      const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      if (!root) {
        finishReveal();
        return;
      }

      await new Promise<void>((resolve) => {
        const finishAnimation = () => {
          finishReveal();
          resolve();
        };

        revealFallbackTimer = window.setTimeout(finishAnimation, 1800);

        gsap.to(root, {
          opacity: 0,
          duration: reducedMotion ? 0.16 : 0.42,
          ease: reducedMotion ? "power1.out" : "power3.inOut",
          onComplete: finishAnimation,
        });
      });
    };

    const run = async () => {
      let completed = 0;
      const resources = [
        waitForFonts(),
        decodeLogo(signal),
        decodeHeroImages(signal),
        waitForInitialVideoFrame(signal),
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
      await Promise.race([allCriticalResources, wait(MAX_DURATION, signal)]);

      if (cancelled) return;

      progressTargetRef.current = 100;
      await waitForDisplayedProgress();
      if (!cancelled) await revealPage();
    };

    finishTimer = window.setTimeout(() => {
      progressTargetRef.current = 100;
    }, MAX_DURATION);

    run();

    return () => {
      cancelled = true;
      abortController.abort();
      window.cancelAnimationFrame(progressFrame);
      window.cancelAnimationFrame(revealFrame);
      window.cancelAnimationFrame(refreshFrame);
      window.clearTimeout(finishTimer);
      window.clearTimeout(revealFallbackTimer);
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
