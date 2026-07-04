"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      const drawStroke = root.querySelector<SVGPathElement>(".linka-brush-draw");
      const fillStroke = root.querySelector<SVGPathElement>(".linka-brush-fill");
      const textureStrokes = root.querySelectorAll<SVGPathElement>(".linka-brush-texture");
      const name = root.querySelector(".linka-preloader-name");

      [drawStroke, fillStroke, ...textureStrokes].forEach((path) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: reducedMotion ? 0 : length,
          autoAlpha: reducedMotion ? 0.72 : 0,
        });
      });
      gsap.set(fillStroke, { strokeWidth: reducedMotion ? 120 : 14, autoAlpha: reducedMotion ? 0.92 : 0 });
      gsap.set(name, { autoAlpha: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 14 });
      gsap.set(wave, { xPercent: 0, yPercent: 0 });

      if (!reducedMotion) {
        gsap
          .timeline({ defaults: { ease: "power2.out" } })
          .to(drawStroke, {
            autoAlpha: 1,
            strokeDashoffset: 0,
            duration: 0.95,
          })
          .to(textureStrokes, { autoAlpha: 0.72, strokeDashoffset: 0, duration: 0.72, stagger: 0.08 }, "-=0.68")
          .to(fillStroke, { autoAlpha: 0.56, strokeDashoffset: 0, strokeWidth: 24, duration: 0.82 }, "-=0.76")
          .to(fillStroke, { strokeWidth: 32, autoAlpha: 0.64, duration: 1.3, repeat: -1, yoyo: true, ease: "sine.inOut" });
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
        gsap.killTweensOf(root.querySelectorAll(".linka-brush-draw, .linka-brush-fill, .linka-brush-texture, .linka-preloader-wave, .linka-preloader-name"));

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
        const drawStroke = root.querySelector(".linka-brush-draw");
        const fillStroke = root.querySelector(".linka-brush-fill");
        const textureStrokes = root.querySelectorAll(".linka-brush-texture");
        const veil = root.querySelector(".linka-preloader-veil");
        const name = root.querySelector(".linka-preloader-name");

        gsap
          .timeline({ onComplete: finishAnimation })
          .to(drawStroke, {
            autoAlpha: 1,
            strokeDashoffset: 0,
            strokeWidth: 6,
            duration: 0.28,
            ease: "power2.out",
          })
          .to(
            textureStrokes,
            {
              autoAlpha: 1,
              strokeDashoffset: 0,
              duration: 0.24,
              stagger: 0.04,
              ease: "power2.out",
            },
            "-=0.2",
          )
          .to(
            fillStroke,
            {
              autoAlpha: 1,
              strokeDashoffset: 0,
              strokeWidth: 138,
              duration: 0.62,
              ease: "power3.inOut",
            },
            "-=0.18",
          )
          .to(
            name,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.24,
              ease: "power2.out",
            },
            "-=0.32",
          )
          .to(veil, { opacity: 0.74, duration: 0.18, ease: "power1.out" }, "-=0.2")
          .to({}, { duration: 0.18 })
          .to(
            name,
            { autoAlpha: 0, y: -12, duration: 0.22, ease: "power2.in" },
          )
          .to(
            wave,
            {
              xPercent: 112,
              yPercent: -12,
              duration: 0.58,
              ease: "power4.inOut",
            },
            "-=0.16",
          )
          .to(
            [drawStroke, fillStroke, ...Array.from(textureStrokes)],
            {
              autoAlpha: 0,
              strokeDashoffset: -120,
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
        gsap.killTweensOf(root.querySelectorAll(".linka-brush-draw, .linka-brush-fill, .linka-brush-texture, .linka-preloader-wave, .linka-preloader-name"));
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
            <linearGradient id="linka-brush-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#64c7ff" stopOpacity="0.12" />
              <stop offset="42%" stopColor="#7dd3fc" stopOpacity="0.95" />
              <stop offset="76%" stopColor="#b7ff32" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#64c7ff" stopOpacity="0.16" />
            </linearGradient>
            <linearGradient id="linka-brush-fill" x1="0%" x2="100%" y1="22%" y2="78%">
              <stop offset="0%" stopColor="#06101f" stopOpacity="0.98" />
              <stop offset="44%" stopColor="#0f407e" stopOpacity="0.98" />
              <stop offset="74%" stopColor="#174f83" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#07101d" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <path
            className="linka-brush-fill"
            d="M -10 58 C 1 36 16 29 28 47 C 39 64 49 78 64 55 C 78 33 88 19 111 34"
          />
          <path
            className="linka-brush-draw"
            d="M -10 58 C 1 36 16 29 28 47 C 39 64 49 78 64 55 C 78 33 88 19 111 34"
          />
          <path
            className="linka-brush-texture linka-brush-texture-a"
            d="M -5 50 C 9 39 20 40 31 53 C 43 67 52 68 65 49 C 78 31 90 28 106 40"
          />
          <path
            className="linka-brush-texture linka-brush-texture-b"
            d="M -8 66 C 8 45 18 43 30 56 C 43 70 53 75 68 58 C 82 42 91 35 109 44"
          />
        </svg>
        <span className="linka-preloader-name">LINKA</span>
      </div>
      <span className="linka-preloader-status">Carregando experiencia Linka</span>
    </div>
  );
}
