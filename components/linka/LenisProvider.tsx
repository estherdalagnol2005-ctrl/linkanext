"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LenisSingleton = {
  instance: Lenis;
  owner: symbol;
  raf: (time: number) => void;
};

declare global {
  interface Window {
    __LINKA_LENIS__?: LenisSingleton;
    __LINKA_PRELOADER_DONE__?: boolean;
  }
}

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const TOUCH_POINTER_QUERY = "(hover: none), (pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PRELOADER_DONE_EVENT = "linka:preloader:done";

export default function LenisProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const owner = Symbol("linka-lenis");
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const touchPointer = window.matchMedia(TOUCH_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let refreshFrame: number | null = null;
    let preloaderDone = window.__LINKA_PRELOADER_DONE__ === true;

    const shouldUseSmoothScroll = () => finePointer.matches && !touchPointer.matches && !reducedMotion.matches;

    const refreshScrollTrigger = () => {
      if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;
        ScrollTrigger.refresh();
      });
    };

    const start = () => {
      if (!shouldUseSmoothScroll() || window.__LINKA_LENIS__) return;

      const lenis = new Lenis({
        anchors: true,
        lerp: 0.145,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.98,
      });
      const raf = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      window.__LINKA_LENIS__ = { instance: lenis, owner, raf };
      refreshScrollTrigger();
    };

    const stop = (refresh = true) => {
      const activeLenis = window.__LINKA_LENIS__;
      if (!activeLenis || activeLenis.owner !== owner) return;

      activeLenis.instance.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(activeLenis.raf);
      gsap.ticker.lagSmoothing(500, 33);
      activeLenis.instance.destroy();
      delete window.__LINKA_LENIS__;
      if (refresh) refreshScrollTrigger();
    };

    const sync = () => {
      if (!preloaderDone) return;
      if (shouldUseSmoothScroll()) start();
      else stop();
    };

    const handlePreloaderDone = () => {
      preloaderDone = true;
      sync();
    };

    if (preloaderDone) sync();
    else window.addEventListener(PRELOADER_DONE_EVENT, handlePreloaderDone, { once: true });

    finePointer.addEventListener("change", sync);
    touchPointer.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);

    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, handlePreloaderDone);
      finePointer.removeEventListener("change", sync);
      touchPointer.removeEventListener("change", sync);
      reducedMotion.removeEventListener("change", sync);
      stop(false);
      if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);
    };
  }, []);

  return null;
}
