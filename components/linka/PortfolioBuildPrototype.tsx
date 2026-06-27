"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const projects = [
  {
    id: "marcenaria",
    name: "Marcenaria",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenariadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenaria.mp4",
  },
  {
    id: "nutricionista",
    name: "Nutricionista",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionistadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionista.mp4",
  },
  {
    id: "casa-sea",
    name: "Casa Sea",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casaseadesktop.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casasea.mp4",
  },
  {
    id: "barbearia",
    name: "Barbearia",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbeariadesktop-1.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbearia.mp4",
  },
  {
    id: "quatorze",
    name: "Quatorze",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorzedesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorze.mp4",
  },
];

const SWIPE_THRESHOLD = 42;

function wrapIndex(index: number) {
  return (index + projects.length) % projects.length;
}

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const switchTimeout = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const activeProject = projects[activeIndex];

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

  const changeProject = useCallback((direction: -1 | 1) => {
    setHasInteracted(true);
    setIsSwitching(true);
    setActiveIndex((currentIndex) => wrapIndex(currentIndex + direction));

    if (switchTimeout.current !== null) {
      window.clearTimeout(switchTimeout.current);
    }

    switchTimeout.current = window.setTimeout(() => {
      setIsSwitching(false);
      switchTimeout.current = null;
    }, 260);
  }, []);

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

  useEffect(() => {
    const frame = window.requestAnimationFrame(playProjectVideos);
    const retry = window.setTimeout(playProjectVideos, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [activeIndex, playProjectVideos]);

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
      if (switchTimeout.current !== null) {
        window.clearTimeout(switchTimeout.current);
      }
    };
  }, []);

  return (
    <section className="lpb-section" aria-label="Portfolio visual de projetos" ref={sectionRef} tabIndex={0}>
      <div className="lpb-shell">
        <div className={hasInteracted ? "lpb-drag-hint is-muted" : "lpb-drag-hint"}>ARRASTE PARA EXPLORAR</div>

        <div
          className={isSwitching ? "lpb-gallery is-switching" : "lpb-gallery"}
          aria-live="polite"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <article className="lpb-project-layer is-active" key={activeProject.id}>
            <div className="lpb-devices">
              <div className="lpb-notebook">
                <div className="lpb-notebook-screen">
                  <div className="lpb-window-bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <video
                    key={`${activeProject.id}-desktop`}
                    className="lpb-project-video"
                    src={activeProject.desktopVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`Projeto ${activeProject.name} no notebook`}
                    onCanPlay={(event) => playVideo(event.currentTarget)}
                    onLoadedData={(event) => playVideo(event.currentTarget)}
                  />
                </div>
                <div className="lpb-notebook-base" />
              </div>

              <div className="lpb-phone">
                <div className="lpb-phone-screen">
                  <div className="lpb-phone-notch" />
                  <video
                    key={`${activeProject.id}-mobile`}
                    className="lpb-project-video"
                    src={activeProject.mobileVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`Projeto ${activeProject.name} no celular`}
                    onCanPlay={(event) => playVideo(event.currentTarget)}
                    onLoadedData={(event) => playVideo(event.currentTarget)}
                  />
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="lpb-project-meta">
          <span>
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <strong>{activeProject.name}</strong>
        </div>

        <div className="lpb-controls" aria-label="Navegar projetos">
          <button type="button" aria-label="Projeto anterior" onClick={() => changeProject(-1)}>
            &lsaquo;
          </button>
          <div className="lpb-dots" aria-hidden="true">
            {projects.map((project, index) => (
              <span className={index === activeIndex ? "is-active" : ""} key={project.id} />
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
