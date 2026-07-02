"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const projects = [
  {
    id: "marcenaria",
    name: "Marcenaria",
    displayTitle: "Site de Captação — Baptista",
    titleType: "Site de Captação",
    titleBrand: "Baptista",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenariadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenaria.mp4",
  },
  {
    id: "nutricionista",
    name: "Nutricionista",
    displayTitle: "Landing Page de Conversão — Manoella Santos",
    titleType: "Landing Page de Conversão",
    titleBrand: "Manoella Santos",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionistadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionista.mp4",
  },
  {
    id: "casa-sea",
    name: "Casa Sea",
    displayTitle: "Landing Page — Casa Sea",
    titleType: "Landing Page",
    titleBrand: "Casa Sea",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casaseadesktop.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casasea.mp4",
  },
  {
    id: "barbearia",
    name: "Barbearia",
    displayTitle: "Site de Conversão — Escobar",
    titleType: "Site de Conversão",
    titleBrand: "Escobar",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbeariadesktop-1.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbearia.mp4",
  },
  {
    id: "quatorze",
    name: "Quatorze",
    displayTitle: "Landing Page — Quatorze Hair Spa",
    titleType: "Landing Page",
    titleBrand: "Quatorze Hair Spa",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorzedesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorze.mp4",
  },
];

const DESKTOP_SWIPE_THRESHOLD = 42;
const MOBILE_SWIPE_THRESHOLD = 22;
const MOBILE_FLICK_THRESHOLD = 12;
const MOBILE_FLICK_VELOCITY = 0.42;
const VIDEO_TRANSITION_DURATION = 0.22;

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

type ViewportMode = "desktop" | "mobile";

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const currentDesktopVideoRef = useRef<HTMLVideoElement>(null);
  const currentMobileVideoRef = useRef<HTMLVideoElement>(null);
  const incomingDesktopVideoRef = useRef<HTMLVideoElement>(null);
  const incomingMobileVideoRef = useRef<HTMLVideoElement>(null);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const videoTimelinesRef = useRef<gsap.core.Timeline[]>([]);
  const transitionTokenRef = useRef(0);
  const requestedIndexRef = useRef(0);
  const preloadedVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragLastX = useRef(0);
  const dragLastTime = useRef(0);
  const dragVelocityX = useRef(0);
  const dragIsHorizontal = useRef(false);
  const dragAbandoned = useRef(false);
  const dragPointerId = useRef<number | null>(null);
  const dragCaptured = useRef(false);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [transitionRequest, setTransitionRequest] = useState<TransitionRequest | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const desktopProject = projects[desktopIndex];
  const mobileProject = projects[mobileIndex];
  const incomingProject = incomingIndex === null ? null : projects[incomingIndex];
  const titleProject = projects[titleIndex];
  const shouldRenderIncomingDesktop = incomingProject !== null && desktopIndex !== incomingIndex;
  const shouldRenderIncomingMobile = incomingProject !== null && mobileIndex !== incomingIndex;

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

  const waitForVideoFrame = useCallback((video: HTMLVideoElement | null, token: number) => {
    if (!video || transitionTokenRef.current !== token) {
      return Promise.resolve(false);
    }

    playVideo(video);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (hasFrame: boolean) => {
        if (settled) return;
        settled = true;
        video.removeEventListener("loadeddata", handleReady);
        video.removeEventListener("canplay", handleReady);
        video.removeEventListener("error", handleError);
        resolve(hasFrame);
      };
      const handleReady = () => finish(true);
      const handleError = () => finish(false);

      video.addEventListener("loadeddata", handleReady, { once: true });
      video.addEventListener("canplay", handleReady, { once: true });
      video.addEventListener("error", handleError, { once: true });
      video.load();
    });
  }, []);

  const requestProject = useCallback((projectIndex: number, direction: TransitionDirection) => {
    const nextIndex = wrapIndex(projectIndex);
    if (nextIndex === requestedIndexRef.current) return;

    transitionTimelineRef.current?.kill();
    videoTimelinesRef.current.forEach((timeline) => timeline.kill());
    videoTimelinesRef.current = [];
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

  function endDragCapture(target: HTMLDivElement) {
    if (dragCaptured.current && dragPointerId.current !== null && target.hasPointerCapture(dragPointerId.current)) {
      target.releasePointerCapture(dragPointerId.current);
    }

    dragStartX.current = null;
    dragStartY.current = null;
    dragLastX.current = 0;
    dragLastTime.current = 0;
    dragVelocityX.current = 0;
    dragIsHorizontal.current = false;
    dragAbandoned.current = false;
    dragPointerId.current = null;
    dragCaptured.current = false;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragStartX.current = event.clientX;
    dragStartY.current = event.clientY;
    dragLastX.current = event.clientX;
    dragLastTime.current = event.timeStamp;
    dragVelocityX.current = 0;
    dragIsHorizontal.current = false;
    dragAbandoned.current = false;
    dragPointerId.current = event.pointerId;
    dragCaptured.current = false;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null || dragStartY.current === null || dragAbandoned.current) return;

    const deltaX = event.clientX - dragStartX.current;
    const deltaY = event.clientY - dragStartY.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const elapsed = Math.max(event.timeStamp - dragLastTime.current, 1);

    dragVelocityX.current = (event.clientX - dragLastX.current) / elapsed;
    dragLastX.current = event.clientX;
    dragLastTime.current = event.timeStamp;

    if (!dragIsHorizontal.current) {
      if (absY > 8 && absX <= absY * 1.15) {
        dragAbandoned.current = true;
        return;
      }

      if (absX > 6 && absX > absY * 1.15) {
        dragIsHorizontal.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragCaptured.current = true;
      }
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    const absDistance = Math.abs(distance);
    const absVelocity = Math.abs(dragVelocityX.current);
    const threshold = viewportMode === "mobile" ? MOBILE_SWIPE_THRESHOLD : DESKTOP_SWIPE_THRESHOLD;
    const isFlick = viewportMode === "mobile" && absDistance >= MOBILE_FLICK_THRESHOLD && absVelocity >= MOBILE_FLICK_VELOCITY;
    const shouldNavigate = dragIsHorizontal.current && (absDistance >= threshold || isFlick);

    endDragCapture(event.currentTarget);

    if (!shouldNavigate) return;
    changeProject(distance < 0 ? 1 : -1);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    endDragCapture(event.currentTarget);
  }

  useLayoutEffect(() => {
    if (!transitionRequest) return;

    const { direction, index, token } = transitionRequest;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const currentDesktopVideo = currentDesktopVideoRef.current;
    const currentMobileVideo = currentMobileVideoRef.current;
    const incomingDesktopVideo = incomingDesktopVideoRef.current;
    const incomingMobileVideo = incomingMobileVideoRef.current;
    const currentVideos = [currentDesktopVideo, currentMobileVideo].filter(Boolean);
    const incomingVideos = [incomingDesktopVideo, incomingMobileVideo].filter(Boolean);
    const incomingOffset = direction * 8;
    const outgoingOffset = direction * -8;
    let desktopSettled = !incomingDesktopVideo || desktopIndex === index;
    let mobileSettled = !incomingMobileVideo || mobileIndex === index;

    gsap.set(currentVideos, { autoAlpha: 1, x: 0 });
    gsap.set(incomingVideos, { autoAlpha: 0, x: incomingOffset });

    const finishTransitionIfReady = () => {
      if (transitionTokenRef.current !== token) return;
      if (!desktopSettled || !mobileSettled) return;

      setIncomingIndex(null);
      setTransitionRequest(null);
    };

    const animateTitle = () => {
      transitionTimelineRef.current?.kill();

      if (reduceMotion) {
        setTitleIndex(index);
        return;
      }

      const titleTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      transitionTimelineRef.current = titleTimeline;

      titleTimeline
        .to(titleRef.current, { autoAlpha: 0, y: direction * -6, duration: 0.1 }, 0)
        .call(() => {
          if (transitionTokenRef.current === token) {
            setTitleIndex(index);
          }
        }, undefined, 0.1)
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: direction * 6 },
          { autoAlpha: 1, y: 0, duration: 0.18 },
          0.11,
        );
    };

    const animateVideoChannel = (
      currentVideo: HTMLVideoElement | null,
      incomingVideo: HTMLVideoElement | null,
      setChannelIndex: (nextIndex: number) => void,
      markSettled: () => void,
    ) => {
      if (!incomingVideo || !currentVideo) {
        markSettled();
        finishTransitionIfReady();
        return;
      }

      void waitForVideoFrame(incomingVideo, token).then((hasFrame) => {
        if (transitionTokenRef.current !== token) return;

        if (!hasFrame || reduceMotion) {
          if (hasFrame) {
            setChannelIndex(index);
          }

          markSettled();
          finishTransitionIfReady();
          return;
        }

        const videoTimeline = gsap
          .timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
              if (transitionTokenRef.current !== token) return;
              setChannelIndex(index);
              markSettled();
              finishTransitionIfReady();
            },
          })
          .to(currentVideo, { autoAlpha: 0, x: outgoingOffset, duration: VIDEO_TRANSITION_DURATION }, 0)
          .to(incomingVideo, { autoAlpha: 1, x: 0, duration: VIDEO_TRANSITION_DURATION }, 0);

        videoTimelinesRef.current.push(videoTimeline);
      });
    };

    const desktopChannel = {
      current: currentDesktopVideo,
      incoming: incomingDesktopVideo,
      setIndex: setDesktopIndex,
      settle: () => {
        desktopSettled = true;
      },
    };
    const mobileChannel = {
      current: currentMobileVideo,
      incoming: incomingMobileVideo,
      setIndex: setMobileIndex,
      settle: () => {
        mobileSettled = true;
      },
    };
    const priorityChannel = viewportMode === "mobile" ? mobileChannel : desktopChannel;
    const secondaryChannel = viewportMode === "mobile" ? desktopChannel : mobileChannel;

    animateTitle();

    if (reduceMotion) {
      if (desktopChannel.incoming) {
        setDesktopIndex(index);
      }
      if (mobileChannel.incoming) {
        setMobileIndex(index);
      }
      setTitleIndex(index);
      setIncomingIndex(null);
      setTransitionRequest(null);
      return;
    }

    animateVideoChannel(priorityChannel.current, priorityChannel.incoming, priorityChannel.setIndex, priorityChannel.settle);
    animateVideoChannel(secondaryChannel.current, secondaryChannel.incoming, secondaryChannel.setIndex, secondaryChannel.settle);
  }, [transitionRequest, viewportMode, waitForVideoFrame]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewportMode = () => setViewportMode(mediaQuery.matches ? "mobile" : "desktop");

    syncViewportMode();
    mediaQuery.addEventListener("change", syncViewportMode);

    return () => mediaQuery.removeEventListener("change", syncViewportMode);
  }, []);

  useEffect(() => {
    const videoKey = viewportMode === "mobile" ? "mobileVideo" : "desktopVideo";
    const neighborIndexes = [wrapIndex(selectedIndex - 1), wrapIndex(selectedIndex + 1)];

    neighborIndexes.forEach((projectIndex) => {
      const src = projects[projectIndex][videoKey];
      if (preloadedVideosRef.current.has(src)) return;

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.src = src;
      video.load();
      preloadedVideosRef.current.set(src, video);
    });
  }, [selectedIndex, viewportMode]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(playProjectVideos);
    const retry = window.setTimeout(playProjectVideos, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [desktopIndex, mobileIndex, incomingIndex, playProjectVideos]);

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
        .to(".lpb-phone", { y: -22, x: 8, ease: "none" }, 0);
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
      videoTimelinesRef.current.forEach((timeline) => timeline.kill());
    };
  }, []);

  return (
    <section className="lpb-section" aria-label="Portfolio visual de projetos" ref={sectionRef} tabIndex={0}>
      <div className="lpb-shell">
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
                      key={`${desktopProject.id}-desktop-current`}
                      className="lpb-project-video is-current"
                      src={desktopProject.desktopVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`Projeto ${desktopProject.name} no notebook`}
                      ref={currentDesktopVideoRef}
                      onCanPlay={(event) => playVideo(event.currentTarget)}
                      onLoadedData={(event) => playVideo(event.currentTarget)}
                    />
                    {shouldRenderIncomingDesktop && incomingProject ? (
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
                      key={`${mobileProject.id}-mobile-current`}
                      className="lpb-project-video is-current"
                      src={mobileProject.mobileVideo}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={`Projeto ${mobileProject.name} no celular`}
                      ref={currentMobileVideoRef}
                      onCanPlay={(event) => playVideo(event.currentTarget)}
                      onLoadedData={(event) => playVideo(event.currentTarget)}
                    />
                    {shouldRenderIncomingMobile && incomingProject ? (
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
          <span className="lpb-counter" aria-label={`${titleIndex + 1} de ${projects.length}`}>
            <span className="lpb-counter-current">{String(titleIndex + 1).padStart(2, "0")}</span>
            <span className="lpb-counter-separator">/</span>
            <span className="lpb-counter-total">{String(projects.length).padStart(2, "0")}</span>
          </span>
          <strong className="lpb-project-title" ref={titleRef}>
            <span className="lpb-project-title-type">{titleProject.titleType}</span>
            <span className="lpb-project-title-separator"> — </span>
            <span className="lpb-project-title-brand">{titleProject.titleBrand}</span>
          </strong>
          <span className="lpb-signal-line" aria-hidden="true" />
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
