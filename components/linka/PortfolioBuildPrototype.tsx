"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const projects = [
  {
    id: "marcenaria",
    name: "Marcenaria",
    displayTitle: "Site de Captação — Baptista",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenariadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenaria.mp4",
  },
  {
    id: "nutricionista",
    name: "Nutricionista",
    displayTitle: "Landing Page de Conversão — Manoella Santos",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionistadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionista.mp4",
  },
  {
    id: "casa-sea",
    name: "Casa Sea",
    displayTitle: "Landing Page — Casa Sea",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casaseadesktop.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casasea.mp4",
  },
  {
    id: "barbearia",
    name: "Barbearia",
    displayTitle: "Site de Conversão — Escobar",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbeariadesktop-1.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbearia.mp4",
  },
  {
    id: "quatorze",
    name: "Quatorze",
    displayTitle: "Landing Page — Quatorze Hair Spa",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorzedesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorze.mp4",
  },
];

const SWIPE_THRESHOLD = 42;
const VIDEO_TRANSITION_DURATION = 0.32;

gsap.registerPlugin(ScrollTrigger);

function wrapIndex(index: number) {
  return (index + projects.length) % projects.length;
}

type TransitionDirection = -1 | 1;

type TransitionRequest = {
  direction: TransitionDirection;
  index: number;
  token: number;
};

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const currentDesktopVideoRef = useRef<HTMLVideoElement>(null);
  const currentMobileVideoRef = useRef<HTMLVideoElement>(null);
  const incomingDesktopVideoRef = useRef<HTMLVideoElement>(null);
  const incomingMobileVideoRef = useRef<HTMLVideoElement>(null);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionTokenRef = useRef(0);
  const requestedIndexRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [transitionRequest, setTransitionRequest] = useState<TransitionRequest | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const activeProject = projects[activeIndex];
  const incomingProject = incomingIndex === null ? null : projects[incomingIndex];
  const titleProject = projects[titleIndex];

  function playVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.defaultMuted = true;

    const playback = video.play();
    void playback.catch(() => undefined);
  }

  const playProjectVideos = useCallback(() => {
    const videos = sectionRef.current?.querySelectorAll<HTMLVideoElement>(".lpb-project-video") ?? [];
    videos.forEach(playVideo);
  }, []);

  const waitForVideo = useCallback((video: HTMLVideoElement | null, token: number) => {
    if (!video || transitionTokenRef.current !== token) {
      return Promise.resolve();
    }

    playVideo(video);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        video.removeEventListener("loadeddata", finish);
        video.removeEventListener("canplay", finish);
        video.removeEventListener("error", finish);
        window.clearTimeout(timeout);
        resolve();
      };
      const timeout = window.setTimeout(finish, 1400);

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("canplay", finish, { once: true });
      video.addEventListener("error", finish, { once: true });
      video.load();
    });
  }, []);

  const requestProject = useCallback((projectIndex: number, direction: TransitionDirection) => {
    const nextIndex = wrapIndex(projectIndex);
    if (nextIndex === requestedIndexRef.current) return;

    transitionTimelineRef.current?.kill();
    transitionTokenRef.current += 1;
    requestedIndexRef.current = nextIndex;
    setHasInteracted(true);
    setSelectedIndex(nextIndex);
    setIncomingIndex(nextIndex);
    setTransitionRequest({ index: nextIndex, direction, token: transitionTokenRef.current });
  }, []);

  const changeProject = useCallback((direction: TransitionDirection) => {
    requestProject(requestedIndexRef.current + direction, direction);
  }, [requestProject]);

  const goToProject = useCallback((projectIndex: number) => {
    const normalizedIndex = wrapIndex(projectIndex);
    const direction = normalizedIndex > requestedIndexRef.current ? 1 : -1;
    requestProject(normalizedIndex, direction);
  }, [requestProject]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragStartX.current = event.clientX;
    dragDeltaX.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;
    dragDeltaX.current = event.clientX - dragStartX.current;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    const distance = dragDeltaX.current;
    dragStartX.current = null;
    dragDeltaX.current = 0;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    changeProject(distance < 0 ? 1 : -1);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current !== null) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartX.current = null;
    dragDeltaX.current = 0;
  }

  useLayoutEffect(() => {
    if (!transitionRequest) return;

    const { direction, index, token } = transitionRequest;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentVideos = [currentDesktopVideoRef.current, currentMobileVideoRef.current].filter(Boolean);
    const incomingVideos = [incomingDesktopVideoRef.current, incomingMobileVideoRef.current].filter(Boolean);
    const incomingOffset = direction * 10;
    const outgoingOffset = direction * -10;

    gsap.set(currentVideos, { autoAlpha: 1, x: 0 });
    gsap.set(incomingVideos, { autoAlpha: 0, x: incomingOffset });

    void Promise.all([
      waitForVideo(incomingDesktopVideoRef.current, token),
      waitForVideo(incomingMobileVideoRef.current, token),
    ]).then(() => {
      if (transitionTokenRef.current !== token) return;

      transitionTimelineRef.current?.kill();

      if (reduceMotion) {
        setActiveIndex(index);
        setTitleIndex(index);
        setIncomingIndex(null);
        setTransitionRequest(null);
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          if (transitionTokenRef.current !== token) return;
          setActiveIndex(index);
          setTitleIndex(index);
          setIncomingIndex(null);
          setTransitionRequest(null);
        },
      });

      transitionTimelineRef.current = timeline;

      timeline
        .to(currentVideos, { autoAlpha: 0, x: outgoingOffset, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(incomingVideos, { autoAlpha: 1, x: 0, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(titleRef.current, { autoAlpha: 0, y: direction * -6, duration: 0.12 }, 0)
        .call(() => {
          if (transitionTokenRef.current === token) {
            setTitleIndex(index);
          }
        }, undefined, 0.13)
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: direction * 6 },
          { autoAlpha: 1, y: 0, duration: 0.2 },
          0.14,
        );
    });
  }, [transitionRequest, waitForVideo]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(playProjectVideos);
    const retry = window.setTimeout(playProjectVideos, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [activeIndex, incomingIndex, playProjectVideos]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(
        [
          ".linka-portfolio-kicker",
          ".linka-portfolio-intro h2",
          ".linka-portfolio-intro p",
          ".lpb-drag-hint",
          ".lpb-notebook",
          ".lpb-phone",
          ".lpb-project-meta",
          ".lpb-controls",
          ".lpb-glow",
        ],
        { autoAlpha: 1, clearProps: "transform,filter" },
      );
      return;
    }

    const context = gsap.context(() => {
      const mount = section.closest(".linka-portfolio-mount") ?? section;
      const introItems = [
        mount.querySelector(".linka-portfolio-kicker"),
        mount.querySelector(".linka-portfolio-intro h2"),
        mount.querySelector(".linka-portfolio-intro p"),
      ].filter(Boolean);

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: mount,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .fromTo(
          introItems,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.09, clearProps: "opacity,visibility,transform" },
        )
        .fromTo(
          ".lpb-drag-hint",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.46, clearProps: "opacity,visibility,transform" },
          "-=0.24",
        )
        .fromTo(
          ".lpb-notebook",
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.78 },
          "-=0.16",
        )
        .fromTo(
          ".lpb-phone",
          { autoAlpha: 0, x: 28, y: 18 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.62 },
          "-=0.5",
        )
        .fromTo(
          ".lpb-project-meta",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.48, clearProps: "opacity,visibility,transform" },
          "-=0.3",
        )
        .fromTo(
          ".lpb-controls",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.42, clearProps: "opacity,visibility,transform" },
          "-=0.32",
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: mount,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        })
        .to(".lpb-notebook", { y: -12, ease: "none" }, 0)
        .to(".lpb-phone", { y: -22, x: 8, ease: "none" }, 0)
        .to(".lpb-glow", { y: 18, scale: 1.035, opacity: 0.78, ease: "none" }, 0);
    }, section);

    return () => context.revert();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!sectionRef.current) return;
      if (!sectionRef.current.matches(":hover") && document.activeElement !== sectionRef.current) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        changeProject(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        changeProject(-1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeProject]);

  useEffect(() => {
    return () => {
      transitionTimelineRef.current?.kill();
    };
  }, []);

  return (
    <section className="lpb-section" aria-label="Portfolio visual de projetos" ref={sectionRef} tabIndex={0}>
      <div className="lpb-shell">
        <div className="lpb-glow" aria-hidden="true" />
        <div className={hasInteracted ? "lpb-drag-hint is-muted" : "lpb-drag-hint"}>ARRASTE PARA EXPLORAR</div>

        <div
          className="lpb-gallery"
          aria-live="polite"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <article className="lpb-project-layer is-active">
            <div className="lpb-devices">
              <div className="lpb-notebook">
                <div className="lpb-notebook-screen">
                  <div className="lpb-window-bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="lpb-video-stack">
                    <video
                      key={`${activeProject.id}-desktop-current`}
                      className="lpb-project-video is-current"
                      src={activeProject.desktopVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`Projeto ${activeProject.name} no notebook`}
                      ref={currentDesktopVideoRef}
                      onCanPlay={(event) => playVideo(event.currentTarget)}
                      onLoadedData={(event) => playVideo(event.currentTarget)}
                    />
                    {incomingProject ? (
                      <video
                        key={`${incomingProject.id}-desktop-incoming-${transitionRequest?.token ?? 0}`}
                        className="lpb-project-video is-incoming"
                        src={incomingProject.desktopVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={`Projeto ${incomingProject.name} no notebook`}
                        ref={incomingDesktopVideoRef}
                        onCanPlay={(event) => playVideo(event.currentTarget)}
                        onLoadedData={(event) => playVideo(event.currentTarget)}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="lpb-notebook-base" />
              </div>

              <div className="lpb-phone">
                <div className="lpb-phone-screen">
                  <div className="lpb-phone-notch" />
                  <div className="lpb-video-stack">
                    <video
                      key={`${activeProject.id}-mobile-current`}
                      className="lpb-project-video is-current"
                      src={activeProject.mobileVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`Projeto ${activeProject.name} no celular`}
                      ref={currentMobileVideoRef}
                      onCanPlay={(event) => playVideo(event.currentTarget)}
                      onLoadedData={(event) => playVideo(event.currentTarget)}
                    />
                    {incomingProject ? (
                      <video
                        key={`${incomingProject.id}-mobile-incoming-${transitionRequest?.token ?? 0}`}
                        className="lpb-project-video is-incoming"
                        src={incomingProject.mobileVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={`Projeto ${incomingProject.name} no celular`}
                        ref={incomingMobileVideoRef}
                        onCanPlay={(event) => playVideo(event.currentTarget)}
                        onLoadedData={(event) => playVideo(event.currentTarget)}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="lpb-project-meta">
          <span>
            {String(titleIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <strong ref={titleRef}>{titleProject.displayTitle}</strong>
        </div>

        <div className="lpb-controls" aria-label="Navegar projetos">
          <button type="button" aria-label="Projeto anterior" onClick={() => changeProject(-1)}>
            &lsaquo;
          </button>
          <div className="lpb-dots" aria-label="Selecionar projeto">
            {projects.map((project, index) => (
              <button
                type="button"
                className={index === selectedIndex ? "is-active" : ""}
                aria-label={`Ver projeto ${project.name}`}
                aria-pressed={index === selectedIndex}
                key={project.id}
                onClick={() => goToProject(index)}
              />
            ))}
          </div>
          <button type="button" aria-label="Proximo projeto" onClick={() => changeProject(1)}>
            &rsaquo;
          </button>
        </div>
      </div>
    </section>
  );
}
