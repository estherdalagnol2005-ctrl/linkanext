"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LINKA_PRELOADER_LOGO_URL } from "./constants";

declare global {
  interface Window {
    __LINKA_PRELOADER_DONE__?: boolean;
  }
}

const MIN_DURATION = 1200;
const MAX_DURATION = 6000;
const PRELOADER_DONE_EVENT = "linka:preloader:done";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type PreloaderStyle = CSSProperties & {
  "--linka-preloader-progress": number;
};

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
  logo.src = LINKA_PRELOADER_LOGO_URL;
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
    const root = rootRef.current;
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (root) {
      const wave = root.querySelector<SVGSVGElement>(".linka-preloader-wave");
      const paths = root.querySelectorAll<SVGPathElement>(".linka-wave-path");
      const fill = root.querySelector<SVGPathElement>(".linka-wave-fill");

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: reducedMotion ? 0 : length,
          autoAlpha: reducedMotion ? 0.72 : 0,
        });
      });
      gsap.set(fill, {
        autoAlpha: reducedMotion ? 0.42 : 0,
        scaleY: reducedMotion ? 1 : 0.04,
        yPercent: reducedMotion ? 0 : 18,
        transformOrigin: "50% 66%",
      });
      gsap.set(wave, { xPercent: 0, yPercent: 0 });

      if (!reducedMotion) {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(paths, {
            autoAlpha: 1,
            strokeDashoffset: 0,
            duration: 1.05,
            stagger: 0.14,
          })
          .to(fill, { autoAlpha: 0.28, scaleY: 0.24, yPercent: 8, duration: 0.65, ease: "sine.out" }, "-=0.58")
          .to(fill, {
            scaleY: 0.32,
            yPercent: 5,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
      }
    }

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

      if (!root) {
        finishReveal();
        return;
      }

      await new Promise<void>((resolve) => {
        const finishAnimation = () => {
          finishReveal();
          resolve();
        };

        revealFallbackTimer = window.setTimeout(finishAnimation, reducedMotion ? 520 : 1900);
        gsap.killTweensOf(root.querySelectorAll(".linka-wave-path, .linka-wave-fill, .linka-preloader-wave"));

        if (reducedMotion) {
          gsap.to(root, {
            opacity: 0,
            duration: 0.22,
            ease: "power1.out",
            onComplete: finishAnimation,
          });
          return;
        }

        const wave = root.querySelector(".linka-preloader-wave");
        const paths = root.querySelectorAll(".linka-wave-path");
        const fill = root.querySelector(".linka-wave-fill");
        const veil = root.querySelector(".linka-preloader-veil");

        gsap
          .timeline({ onComplete: finishAnimation })
          .to(paths, {
            autoAlpha: 1,
            strokeDashoffset: 0,
            strokeWidth: (index) => (index === 0 ? 5.8 : 2.6),
            duration: 0.34,
            ease: "power2.out",
          })
          .to(
            fill,
            {
              autoAlpha: 1,
              scaleY: 2.75,
              yPercent: -42,
              duration: 0.58,
              ease: "power3.inOut",
            },
            "-=0.18",
          )
          .to(veil, { opacity: 0.72, duration: 0.18, ease: "power1.out" }, "-=0.18")
          .to({}, { duration: 0.12 })
          .to(wave, {
            xPercent: 112,
            yPercent: -18,
            duration: 0.56,
            ease: "power4.inOut",
          })
          .to(
            paths,
            {
              strokeDashoffset: -140,
              autoAlpha: 0,
              duration: 0.34,
              ease: "power2.inOut",
            },
            "-=0.5",
          )
          .to(
            fill,
            {
            autoAlpha: 0,
              duration: 0.36,
              ease: "power3.inOut",
            },
            "-=0.42",
          )
          .to(root, { opacity: 0, duration: 0.24, ease: "power2.out" }, "-=0.22");
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
        gsap.killTweensOf(root.querySelectorAll(".linka-wave-path, .linka-wave-fill, .linka-preloader-wave"));
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
      style={{ "--linka-preloader-progress": progress / 100 } as PreloaderStyle}
    >
      <div className="linka-preloader-stage" aria-hidden="true">
        <span className="linka-preloader-veil" />
        <svg
          aria-hidden="true"
          className="linka-preloader-wave"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="linka-wave-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#64c7ff" stopOpacity="0.12" />
              <stop offset="42%" stopColor="#7dd3fc" stopOpacity="0.95" />
              <stop offset="76%" stopColor="#b7ff32" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#64c7ff" stopOpacity="0.16" />
            </linearGradient>
            <linearGradient id="linka-wave-fill" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#0a1833" stopOpacity="0.98" />
              <stop offset="50%" stopColor="#103e82" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#06101f" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <path
            className="linka-wave-fill"
            d="M -8 70 C 9 48 18 83 32 58 C 44 36 55 38 67 59 C 78 79 89 70 108 42 L 108 118 L -8 118 Z"
          />
          <path
            className="linka-wave-path linka-wave-path-base"
            d="M -8 70 C 9 48 18 83 32 58 C 44 36 55 38 67 59 C 78 79 89 70 108 42"
          />
          <path
            className="linka-wave-path linka-wave-path-accent"
            d="M -6 63 C 10 40 23 76 35 55 C 48 34 59 40 70 58 C 82 77 92 66 106 46"
          />
        </svg>
      </div>
      <span className="linka-preloader-status">Carregando experiencia Linka</span>
    </div>
  );
}
