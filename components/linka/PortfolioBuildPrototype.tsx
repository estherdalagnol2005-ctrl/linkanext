"use client";

import { useState } from "react";

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
    title: "ESTRATÉGIA",
    description: "Direção definida",
  },
  {
    index: "02",
    title: "IDENTIDADE",
    description: "A marca ganha forma",
  },
  {
    index: "03",
    title: "EXPERIÊNCIA",
    description: "Interações com propósito",
  },
  {
    index: "04",
    title: "CONVERSÃO",
    description: "Pronto para gerar resultado",
  },
];

export default function PortfolioBuildPrototype() {
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];

  return (
    <section className="lpb-section" aria-label="Experiência em construção">
      <div className="lpb-shell">
        <div className="lpb-devices" aria-hidden="true">
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
              />
            </div>
          </div>
        </div>

        <div className="lpb-content">
          <div className="lpb-panel">
            <span className="lpb-eyebrow">EXPERIÊNCIA EM CONSTRUÇÃO</span>
            <strong className="lpb-status">4 / 4 módulos conectados</strong>
            <p>
              Cada camada transforma uma ideia
              <br />
              em uma experiência digital completa.
            </p>
            <div className="lpb-progress" aria-label="Progresso 100%">
              <span />
            </div>
          </div>

          <div className="lpb-selector" aria-label="Selecionar projeto">
            {projects.map((project) => (
              <button
                className={project.id === activeProject.id ? "lpb-project-tab is-active" : "lpb-project-tab"}
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                type="button"
                aria-pressed={project.id === activeProject.id}
              >
                {project.name}
              </button>
            ))}
          </div>

          <div className="lpb-modules" aria-label="Módulos conectados">
            {modules.map((module) => (
              <article className="lpb-module" key={module.index}>
                <span>{module.index}</span>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
