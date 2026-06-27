"use client";

import { type SyntheticEvent, useEffect, useRef, useState } from "react";

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

const modules = [
  {
    index: "01",
    id: "strategy",
    className: "is-strategy",
    title: "Estratégia",
    description: "A direção que organiza todo o projeto.",
    progress: 25,
  },
  {
    index: "02",
    id: "identity",
    className: "is-identity",
    title: "Identidade",
    description: "A marca começa a ganhar personalidade.",
    progress: 50,
  },
  {
    index: "03",
    id: "experience",
    className: "is-experience",
    title: "Experiência",
    description: "Cada interação passa a ter propósito.",
    progress: 75,
  },
  {
    index: "04",
    id: "conversion",
    className: "is-conversion",
    title: "Conversão",
    description: "O projeto fica pronto para gerar resultado.",
    progress: 100,
  },
];

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [activeModuleId, setActiveModuleId] = useState(modules[0].id);
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0];

  function playVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.defaultMuted = true;

    const playback = video.play();
    void playback.catch(() => undefined);
  }

  function playProjectVideos() {
    const videos = sectionRef.current?.querySelectorAll<HTMLVideoElement>(".lpb-project-video") ?? [];
    videos.forEach(playVideo);
  }

  function handleVideoReady(event: SyntheticEvent<HTMLVideoElement>) {
    playVideo(event.currentTarget);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(playProjectVideos);
    const retry = window.setTimeout(playProjectVideos, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [activeProjectId]);

  return (
    <section className="lpb-section" aria-label="Experiência em construção" ref={sectionRef}>
      <div className="lpb-shell">
        <div className={`lpb-devices ${activeModule.className}`} aria-hidden="true">
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
                onCanPlay={handleVideoReady}
                onLoadedData={handleVideoReady}
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
                onCanPlay={handleVideoReady}
                onLoadedData={handleVideoReady}
              />
            </div>
          </div>
        </div>

        <div className="lpb-content">
          <div className="lpb-panel">
            <span className="lpb-eyebrow">EXPERIÊNCIA EM CONSTRUÇÃO</span>
            <div className="lpb-active-copy" key={activeModule.id}>
              <strong className="lpb-status">{activeModule.title}</strong>
              <p>{activeModule.description}</p>
            </div>
            <div className="lpb-progress" aria-label={`Progresso ${activeModule.progress}%`}>
              <span style={{ width: `${activeModule.progress}%` }} />
            </div>
          </div>

          <div className="lpb-steps" aria-label="Etapas da experiência">
            {modules.map((module) => (
              <button
                className={`lpb-step ${module.className} ${module.id === activeModule.id ? "is-active" : ""}`}
                key={module.id}
                onClick={() => {
                  setActiveModuleId(module.id);
                  playProjectVideos();
                }}
                type="button"
                aria-pressed={module.id === activeModule.id}
              >
                <span>{module.index}</span>
                {module.title}
              </button>
            ))}
          </div>

          <div className="lpb-selector" aria-label="Selecionar projeto">
            {projects.map((project) => (
              <button
                className={project.id === activeProject.id ? "lpb-project-tab is-active" : "lpb-project-tab"}
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id);
                  playProjectVideos();
                }}
                type="button"
                aria-pressed={project.id === activeProject.id}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
