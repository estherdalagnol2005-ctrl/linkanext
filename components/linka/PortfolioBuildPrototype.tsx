"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const projects = [
  {
    id: "marcenaria",
    name: "Marcenaria",
    displayTitle: "Site de Captação — Baptista",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenariadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/marcenaria.mp4",
    desktopPreview: "/portfolio-previews/marcenaria-desktop.webp",
    mobilePreview: "/portfolio-previews/marcenaria-mobile.webp",
  },
  {
    id: "nutricionista",
    name: "Nutricionista",
    displayTitle: "Landing Page de Conversão — Manoella Santos",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionistadesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/nutricionista.mp4",
    desktopPreview: "/portfolio-previews/nutricionista-desktop.webp",
    mobilePreview: "/portfolio-previews/nutricionista-mobile.webp",
  },
  {
    id: "casa-sea",
    name: "Casa Sea",
    displayTitle: "Landing Page — Casa Sea",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casaseadesktop.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/casasea.mp4",
    desktopPreview: "/portfolio-previews/casa-sea-desktop.webp",
    mobilePreview: "/portfolio-previews/casa-sea-mobile.webp",
  },
  {
    id: "barbearia",
    name: "Barbearia",
    displayTitle: "Site de Conversão — Escobar",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbeariadesktop-1.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/barbearia.mp4",
    desktopPreview: "/portfolio-previews/barbearia-desktop.webp",
    mobilePreview: "/portfolio-previews/barbearia-mobile.webp",
  },
  {
    id: "quatorze",
    name: "Quatorze",
    displayTitle: "Landing Page — Quatorze Hair Spa",
    desktopVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorzedesktopmp4.mp4",
    mobileVideo: "https://linkadigital.online/wp-content/uploads/2026/06/quatorze.mp4",
    desktopPreview: "/portfolio-previews/quatorze-desktop.webp",
    mobilePreview: "/portfolio-previews/quatorze-mobile.webp",
  },
];

type PortfolioMode = "orbit" | "opening" | "focus" | "closing";

type ProjectPose = {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const ORBIT_STEP = 360 / projects.length;
const SWIPE_THRESHOLD = 42;
const DRAG_ROTATION_SPEED = 0.28;
const DESKTOP_ORBIT_DURATION = 44;
const MOBILE_ORBIT_DURATION = 40;
const AUTO_RESUME_DELAY = 800;

gsap.registerPlugin(ScrollTrigger);

function wrapIndex(index: number) {
  return (index + projects.length) % projects.length;
}

function normalizeAngle(angle: number) {
  return ((((angle + 180) % 360) + 360) % 360) - 180;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getShortestTargetAngle(currentAngle: number, targetAngle: number) {
  return currentAngle + normalizeAngle(targetAngle - currentAngle);
}

function getNearestProjectIndex(orbitAngle: number) {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  projects.forEach((_, index) => {
    const distance = Math.abs(normalizeAngle(index * ORBIT_STEP + orbitAngle));

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function getRelativeOffset(index: number, activeIndex: number) {
  let offset = index - activeIndex;
  const half = projects.length / 2;

  if (offset > half) offset -= projects.length;
  if (offset < -half) offset += projects.length;

  return offset;
}

function getProjectPose(
  index: number,
  activeIndex: number,
  orbitAngle: number,
  mode: PortfolioMode,
  isCompact: boolean,
): ProjectPose {
  if (mode === "opening") {
    const offset = getRelativeOffset(index, activeIndex);
    const distance = Math.abs(offset);
    const isActive = offset === 0;

    return {
      x: isActive ? 0 : offset * (isCompact ? 118 : 220),
      y: isActive ? (isCompact ? 22 : 32) : (isCompact ? 36 : 48) + distance * 12,
      z: isActive ? (isCompact ? 190 : 310) : -260 - distance * 70,
      rotateY: isActive ? 0 : offset * -18,
      scale: isActive ? (isCompact ? 1 : 1.08) : Math.max(0.38, 0.58 - distance * 0.08),
      opacity: isActive ? 1 : 0,
      zIndex: isActive ? 90 : 12 - distance,
    };
  }

  const angle = normalizeAngle(index * ORBIT_STEP + orbitAngle);
  const radians = (angle * Math.PI) / 180;
  const frontness = (Math.cos(radians) + 1) / 2;
  const side = Math.sin(radians);
  const xRadius = 310;
  const zRadius = 430;

  return {
    x: side * xRadius,
    y: Math.abs(side) * 24 + (1 - frontness) * 20,
    z: Math.cos(radians) * zRadius - 250,
    rotateY: angle * -0.52,
    scale: 0.54 + frontness * 0.48,
    opacity: 0.22 + frontness * 0.78,
    zIndex: Math.round(frontness * 50),
  };
}

function getPoseStyle(pose: ProjectPose) {
  return {
    "--lpb-card-x": `${pose.x.toFixed(2)}px`,
    "--lpb-card-y": `${pose.y.toFixed(2)}px`,
    "--lpb-card-z": `${pose.z.toFixed(2)}px`,
    "--lpb-card-rotate-y": `${pose.rotateY.toFixed(2)}deg`,
    "--lpb-card-scale": pose.scale.toFixed(3),
    "--lpb-card-opacity": pose.opacity.toFixed(3),
    "--lpb-card-z-index": pose.zIndex,
  } as CSSProperties;
}

function readCardIndex(card: HTMLButtonElement | null) {
  if (!card?.dataset.index) return null;

  return Number(card.dataset.index);
}

function renderOrbitMockup(project: (typeof projects)[number]) {
  return (
    <>
      <span className="lpb-orbit-mockup" aria-hidden="true">
        <span className="lpb-mini-notebook">
          <span className="lpb-mini-notebook-screen">
            <img src={project.desktopPreview} alt="" loading="lazy" decoding="async" draggable={false} />
          </span>
          <span className="lpb-mini-notebook-base" />
        </span>

        <span className="lpb-mini-phone">
          <span className="lpb-mini-phone-screen">
            <img src={project.mobilePreview} alt="" loading="lazy" decoding="async" draggable={false} />
          </span>
        </span>
      </span>

      <span className="lpb-preview-name">{project.name}</span>
    </>
  );
}

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileOrbitStageRef = useRef<HTMLDivElement>(null);
  const mobileOrbitRingRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartAngle = useRef(0);
  const dragDeltaX = useRef(0);
  const dragHasHorizontalIntent = useRef(false);
  const dragVelocity = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const pendingClickIndex = useRef<number | null>(null);
  const ignoreClick = useRef(false);
  const switchTimeout = useRef<number | null>(null);
  const autoResumeTimeout = useRef<number | null>(null);
  const autoOrbitTween = useRef<gsap.core.Tween | null>(null);
  const snapOrbitTween = useRef<gsap.core.Tween | null>(null);
  const orbitProxy = useRef({ angle: 0 });
  const orbitAngleRef = useRef(0);
  const pendingOrbitAngle = useRef(0);
  const orbitFrame = useRef<number | null>(null);
  const orbitCardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const visualActiveIndexRef = useRef(0);
  const returnOrbitAngleRef = useRef(0);
  const shouldAnimateOrbitReturn = useRef(false);
  const activeIndexRef = useRef(0);
  const modeRef = useRef<PortfolioMode>("orbit");
  const isSwitchingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isCompactRef = useRef(false);
  const reduceMotionRef = useRef(false);

  const [mode, setMode] = useState<PortfolioMode>("orbit");
  const [activeIndex, setActiveIndex] = useState(0);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const activeProject = projects[activeIndex];
  const showsOrbit = mode === "orbit" || mode === "opening";
  const showsProject = mode === "focus" || mode === "closing";

  const updateSwitchingState = useCallback((nextState: boolean) => {
    isSwitchingRef.current = nextState;
    setIsSwitching(nextState);
  }, []);

  const setActiveProject = useCallback((index: number) => {
    const nextIndex = wrapIndex(index);
    activeIndexRef.current = nextIndex;
    visualActiveIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, []);

  const writeCardPose = useCallback((card: HTMLButtonElement, pose: ProjectPose) => {
    card.style.setProperty("--lpb-card-x", `${pose.x.toFixed(2)}px`);
    card.style.setProperty("--lpb-card-y", `${pose.y.toFixed(2)}px`);
    card.style.setProperty("--lpb-card-z", `${pose.z.toFixed(2)}px`);
    card.style.setProperty("--lpb-card-rotate-y", `${pose.rotateY.toFixed(2)}deg`);
    card.style.setProperty("--lpb-card-scale", pose.scale.toFixed(3));
    card.style.setProperty("--lpb-card-opacity", pose.opacity.toFixed(3));
    card.style.setProperty("--lpb-card-z-index", String(pose.zIndex));
  }, []);

  const setVisualActiveProject = useCallback((index: number) => {
    orbitCardRefs.current.forEach((card, cardIndex) => {
      if (!card) return;

      card.classList.toggle("is-selected", cardIndex === index);
    });

    visualActiveIndexRef.current = index;
  }, []);

  const writeMobileRingAngle = useCallback((nextAngle: number) => {
    mobileOrbitRingRef.current?.style.setProperty("--lpb-mobile-ring-angle", `${nextAngle.toFixed(2)}deg`);
  }, []);

  const renderOrbitAtAngle = useCallback(
    (nextAngle: number, updateVisualProject = true) => {
      orbitAngleRef.current = nextAngle;
      orbitProxy.current.angle = nextAngle;
      pendingOrbitAngle.current = nextAngle;

      if (modeRef.current !== "orbit") return;

      if (isCompactRef.current) {
        writeMobileRingAngle(nextAngle);
        return;
      }

      orbitCardRefs.current.forEach((card, index) => {
        if (!card) return;

        writeCardPose(card, getProjectPose(index, activeIndexRef.current, nextAngle, "orbit", false));
      });

      if (updateVisualProject) {
        setVisualActiveProject(getNearestProjectIndex(nextAngle));
      }
    },
    [setVisualActiveProject, writeCardPose, writeMobileRingAngle],
  );

  const scheduleOrbitRender = useCallback(
    (nextAngle: number) => {
      pendingOrbitAngle.current = nextAngle;

      if (orbitFrame.current !== null) return;

      orbitFrame.current = window.requestAnimationFrame(() => {
        orbitFrame.current = null;
        renderOrbitAtAngle(pendingOrbitAngle.current, true);
      });
    },
    [renderOrbitAtAngle],
  );

  const commitOrbitAngle = useCallback(
    (nextAngle: number, updateActiveProject = true) => {
      if (orbitFrame.current !== null) {
        window.cancelAnimationFrame(orbitFrame.current);
        orbitFrame.current = null;
      }

      renderOrbitAtAngle(nextAngle, updateActiveProject);
      setOrbitAngle(nextAngle);

      if (updateActiveProject) {
        const nearestProject = getNearestProjectIndex(nextAngle);
        setVisualActiveProject(nearestProject);
        setActiveProject(nearestProject);
      }
    },
    [renderOrbitAtAngle, setActiveProject, setVisualActiveProject],
  );

  const applyOrbitAngle = useCallback(
    (nextAngle: number, updateActiveProject = true) => {
      commitOrbitAngle(nextAngle, updateActiveProject);
    },
    [commitOrbitAngle],
  );

  const clearSwitchState = useCallback(() => {
    if (switchTimeout.current !== null) {
      window.clearTimeout(switchTimeout.current);
    }

    switchTimeout.current = window.setTimeout(() => {
      updateSwitchingState(false);
      switchTimeout.current = null;
    }, 360);
  }, [updateSwitchingState]);

  const clearAutoOrbitResume = useCallback(() => {
    if (autoResumeTimeout.current !== null) {
      window.clearTimeout(autoResumeTimeout.current);
      autoResumeTimeout.current = null;
    }
  }, []);

  const stopAutoOrbit = useCallback(() => {
    clearAutoOrbitResume();

    if (autoOrbitTween.current) {
      autoOrbitTween.current.kill();
      autoOrbitTween.current = null;
    }
  }, [clearAutoOrbitResume]);

  const startAutoOrbit = useCallback(() => {
    clearAutoOrbitResume();

    if (autoOrbitTween.current) {
      autoOrbitTween.current.kill();
      autoOrbitTween.current = null;
    }

    if (
      reduceMotionRef.current ||
      !sectionRef.current ||
      modeRef.current !== "orbit" ||
      isSwitchingRef.current ||
      isPointerDownRef.current
    ) {
      return;
    }

    orbitProxy.current.angle = orbitAngleRef.current;
    autoOrbitTween.current = gsap.to(orbitProxy.current, {
      angle: "-=360",
      duration: isCompactRef.current ? MOBILE_ORBIT_DURATION : DESKTOP_ORBIT_DURATION,
      ease: "none",
      repeat: -1,
      overwrite: true,
      onUpdate: () => renderOrbitAtAngle(orbitProxy.current.angle, true),
    });
  }, [clearAutoOrbitResume, renderOrbitAtAngle]);

  const scheduleAutoOrbitResume = useCallback(() => {
    clearAutoOrbitResume();

    if (
      reduceMotionRef.current ||
      !sectionRef.current ||
      modeRef.current !== "orbit" ||
      isSwitchingRef.current ||
      isPointerDownRef.current
    ) {
      return;
    }

    autoResumeTimeout.current = window.setTimeout(() => {
      autoResumeTimeout.current = null;
      startAutoOrbit();
    }, AUTO_RESUME_DELAY);
  }, [clearAutoOrbitResume, startAutoOrbit]);

  const markInteraction = useCallback(() => {
    setHasInteracted(true);
    stopAutoOrbit();
  }, [stopAutoOrbit]);

  function getDragRotationSpeed() {
    if (!isCompactRef.current) return DRAG_ROTATION_SPEED;

    const stageWidth = clamp(mobileOrbitStageRef.current?.clientWidth || window.innerWidth || 390, 320, 460);
    return ORBIT_STEP / Math.max(104, stageWidth * 0.3);
  }

  function getSnapDuration(currentAngle: number, targetAngle: number) {
    const distance = Math.abs(targetAngle - currentAngle);
    return clamp(0.4 + Math.min(distance / 180, 1) * 0.25, 0.4, 0.65);
  }

  const snapOrbitToProject = useCallback(
    (index: number, duration = 0.52, updateActiveProject = true, onComplete?: () => void) => {
      const targetAngle = getShortestTargetAngle(orbitAngleRef.current, -wrapIndex(index) * ORBIT_STEP);

      if (snapOrbitTween.current) {
        snapOrbitTween.current.kill();
      }

      if (reduceMotionRef.current) {
        commitOrbitAngle(targetAngle, updateActiveProject);
        onComplete?.();
        return;
      }

      orbitProxy.current.angle = orbitAngleRef.current;

      snapOrbitTween.current = gsap.to(orbitProxy.current, {
        angle: targetAngle,
        duration,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => renderOrbitAtAngle(orbitProxy.current.angle, updateActiveProject),
        onComplete: () => {
          commitOrbitAngle(targetAngle, updateActiveProject);
          snapOrbitTween.current = null;
          onComplete?.();
        },
      });
    },
    [commitOrbitAngle, renderOrbitAtAngle],
  );

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

  const changeProject = useCallback(
    (direction: -1 | 1) => {
      if (modeRef.current !== "orbit") return;

      markInteraction();
      const nextIndex = wrapIndex(getNearestProjectIndex(orbitAngleRef.current) + direction);

      updateSwitchingState(true);
      setActiveProject(nextIndex);
      snapOrbitToProject(
        nextIndex,
        modeRef.current === "orbit" ? 0.5 : 0.42,
        modeRef.current === "orbit",
        scheduleAutoOrbitResume,
      );
      clearSwitchState();
    },
    [clearSwitchState, markInteraction, scheduleAutoOrbitResume, setActiveProject, snapOrbitToProject, updateSwitchingState],
  );

  const openProject = useCallback(
    (index: number) => {
      if (modeRef.current !== "orbit") return;

      markInteraction();
      returnOrbitAngleRef.current = getShortestTargetAngle(orbitAngleRef.current, -wrapIndex(index) * ORBIT_STEP);
      modeRef.current = "opening";
      setMode("opening");
      updateSwitchingState(true);
      setActiveProject(index);

      if (isCompact) {
        window.requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({
            block: "center",
            behavior: reduceMotionRef.current ? "auto" : "smooth",
          });
        });
      }
    },
    [isCompact, markInteraction, setActiveProject, updateSwitchingState],
  );

  const selectProject = useCallback(
    (index: number) => {
      if (ignoreClick.current) return;

      if (modeRef.current === "orbit") {
        if (isCompactRef.current) {
          markInteraction();
          snapOrbitToProject(index, 0.46, true, () => openProject(index));
          return;
        }

        openProject(index);
      }
    },
    [markInteraction, openProject, snapOrbitToProject],
  );

  const returnToOrbit = useCallback(() => {
    if (modeRef.current !== "focus") return;

    modeRef.current = "closing";
    setMode("closing");
    updateSwitchingState(true);
  }, [updateSwitchingState]);

  function getProjectIndexFromPoint(target: EventTarget | null, clientX: number, clientY: number) {
    const directCard =
      (target as HTMLElement | null)?.closest<HTMLButtonElement>(".lpb-orbit-card, .lpb-mobile-orbit-card") ?? null;
    const directIndex = readCardIndex(directCard);

    if (directIndex !== null) return directIndex;

    const cards = sectionRef.current?.querySelectorAll<HTMLButtonElement>(".lpb-orbit-card, .lpb-mobile-orbit-card") ?? [];
    let nearestIndex: number | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const padding = modeRef.current === "focus" ? 18 : 10;
      const isInside =
        clientX >= rect.left - padding &&
        clientX <= rect.right + padding &&
        clientY >= rect.top - padding &&
        clientY <= rect.bottom + padding;

      if (!isInside) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = readCardIndex(card);
      }
    });

    return nearestIndex;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (modeRef.current !== "orbit") return;

    isPointerDownRef.current = true;
    const currentAngle = orbitAngleRef.current;
    setOrbitAngle(currentAngle);
    if (!isCompactRef.current) {
      setActiveProject(getNearestProjectIndex(currentAngle));
    }
    markInteraction();

    if (snapOrbitTween.current) {
      snapOrbitTween.current.kill();
      snapOrbitTween.current = null;
    }

    pendingClickIndex.current = getProjectIndexFromPoint(event.target, event.clientX, event.clientY);
    dragStartX.current = event.clientX;
    dragStartY.current = event.clientY;
    dragStartAngle.current = orbitAngleRef.current;
    dragDeltaX.current = 0;
    dragHasHorizontalIntent.current = false;
    dragVelocity.current = 0;
    lastDragX.current = event.clientX;
    lastDragTime.current = event.timeStamp || performance.now();
    ignoreClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;

    dragDeltaX.current = event.clientX - dragStartX.current;
    const dragDeltaY = event.clientY - (dragStartY.current ?? event.clientY);

    if (!dragHasHorizontalIntent.current) {
      if (Math.abs(dragDeltaY) > 10 && Math.abs(dragDeltaY) > Math.abs(dragDeltaX.current) * 1.2) return;
      if (Math.abs(dragDeltaX.current) <= 4) return;

      dragHasHorizontalIntent.current = true;
    }

    if (modeRef.current === "orbit") {
      const dragSpeed = getDragRotationSpeed();
      const now = event.timeStamp || performance.now();
      const elapsed = Math.max(16, now - lastDragTime.current);

      dragVelocity.current = ((event.clientX - lastDragX.current) * dragSpeed) / elapsed;
      lastDragX.current = event.clientX;
      lastDragTime.current = now;

      scheduleOrbitRender(dragStartAngle.current + dragDeltaX.current * dragSpeed);
    }
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) return;

    isPointerDownRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const distance = dragDeltaX.current;
    const hadHorizontalIntent = dragHasHorizontalIntent.current;
    const clickIndex = pendingClickIndex.current;
    dragStartX.current = null;
    dragStartY.current = null;
    pendingClickIndex.current = null;
    dragDeltaX.current = 0;
    dragHasHorizontalIntent.current = false;

    if (!hadHorizontalIntent && Math.abs(distance) <= 8 && clickIndex !== null) {
      selectProject(clickIndex);
      ignoreClick.current = true;
      window.setTimeout(() => {
        ignoreClick.current = false;
      }, 0);
      return;
    }

    if (Math.abs(distance) > 8) {
      ignoreClick.current = true;
      window.setTimeout(() => {
        ignoreClick.current = false;
      }, 0);
    }

    if (modeRef.current === "orbit") {
      if (orbitFrame.current !== null) {
        window.cancelAnimationFrame(orbitFrame.current);
        orbitFrame.current = null;
        renderOrbitAtAngle(pendingOrbitAngle.current, true);
      }

      const currentAngle = orbitAngleRef.current;
      const projectedAngle = currentAngle + clamp(dragVelocity.current * 280, -ORBIT_STEP * 2.4, ORBIT_STEP * 2.4);
      const targetIndex = getNearestProjectIndex(projectedAngle);
      const targetAngle = getShortestTargetAngle(currentAngle, -targetIndex * ORBIT_STEP);

      snapOrbitToProject(targetIndex, getSnapDuration(currentAngle, targetAngle), true, scheduleAutoOrbitResume);
      return;
    }

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    changeProject(distance < 0 ? 1 : -1);
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    isPointerDownRef.current = false;

    if (dragStartX.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (modeRef.current === "orbit" && dragHasHorizontalIntent.current) {
      if (orbitFrame.current !== null) {
        window.cancelAnimationFrame(orbitFrame.current);
        orbitFrame.current = null;
        renderOrbitAtAngle(pendingOrbitAngle.current, true);
      }

      snapOrbitToProject(getNearestProjectIndex(orbitAngleRef.current), 0.45, true, scheduleAutoOrbitResume);
    }

    dragStartX.current = null;
    dragStartY.current = null;
    pendingClickIndex.current = null;
    dragDeltaX.current = 0;
    dragHasHorizontalIntent.current = false;
    dragVelocity.current = 0;
  }

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const updateCompactState = () => {
      isCompactRef.current = query.matches;
      setIsCompact(query.matches);
    };

    updateCompactState();
    query.addEventListener("change", updateCompactState);

    return () => query.removeEventListener("change", updateCompactState);
  }, []);

  useLayoutEffect(() => {
    if (!isCompact || !showsOrbit) return undefined;

    const updateMobileOrbitMetrics = () => {
      const stage = mobileOrbitStageRef.current;
      const stageWidth = Math.round(stage?.clientWidth || window.innerWidth || 390);
      const radius = clamp(stageWidth * 0.37, 138, 160);
      const cardWidth = clamp(stageWidth * 0.32, 126, 136);
      const cardHeight = clamp(cardWidth * 0.68, 88, 96);

      stage?.style.setProperty("--lpb-mobile-orbit-radius", `${radius.toFixed(1)}px`);
      stage?.style.setProperty("--lpb-mobile-card-width", `${cardWidth.toFixed(1)}px`);
      stage?.style.setProperty("--lpb-mobile-card-height", `${cardHeight.toFixed(1)}px`);
      renderOrbitAtAngle(orbitAngleRef.current, true);
    };

    updateMobileOrbitMetrics();

    if (!mobileOrbitStageRef.current || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateMobileOrbitMetrics);
      return () => window.removeEventListener("resize", updateMobileOrbitMetrics);
    }

    const resizeObserver = new ResizeObserver(updateMobileOrbitMetrics);
    resizeObserver.observe(mobileOrbitStageRef.current);
    window.addEventListener("orientationchange", updateMobileOrbitMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("orientationchange", updateMobileOrbitMetrics);
    };
  }, [isCompact, renderOrbitAtAngle, showsOrbit]);

  useLayoutEffect(() => {
    if (mode !== "orbit") return;

    renderOrbitAtAngle(orbitAngleRef.current, true);
  }, [isCompact, mode, renderOrbitAtAngle]);

  useEffect(() => {
    if (mode !== "focus") return undefined;

    const frame = window.requestAnimationFrame(playProjectVideos);
    const retry = window.setTimeout(playProjectVideos, 240);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [activeIndex, mode, playProjectVideos]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || mode !== "opening") return undefined;

    if (reduceMotionRef.current) {
      modeRef.current = "focus";
      setMode("focus");
      updateSwitchingState(false);
      return undefined;
    }

    const context = gsap.context(() => {
      const selectedCard = section.querySelector(".lpb-orbit-card.is-selected, .lpb-mobile-orbit-card.is-selected");
      const otherCards = Array.from(
        section.querySelectorAll(".lpb-orbit-card:not(.is-selected), .lpb-mobile-orbit-card:not(.is-selected)"),
      );

      if (!selectedCard) {
        modeRef.current = "focus";
        setMode("focus");
        updateSwitchingState(false);
        return;
      }

      gsap.to(otherCards, {
        autoAlpha: 0,
        scale: 0.72,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      });

      gsap.to(selectedCard, {
        filter: "brightness(1.18)",
        duration: 0.28,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          gsap.to(selectedCard, {
            autoAlpha: 0,
            scale: 0.88,
            duration: 0.16,
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
              modeRef.current = "focus";
              setMode("focus");
              updateSwitchingState(false);
            },
          });
        },
      });
    }, section);

    return () => context.revert();
  }, [mode, updateSwitchingState]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || mode !== "closing") return undefined;

    if (reduceMotionRef.current) {
      applyOrbitAngle(returnOrbitAngleRef.current, true);
      shouldAnimateOrbitReturn.current = false;
      modeRef.current = "orbit";
      setMode("orbit");
      updateSwitchingState(false);
      return undefined;
    }

    const context = gsap.context(() => {
      const exitItems = [
        section.querySelector(".lpb-device-stage"),
        section.querySelector(".lpb-project-meta"),
        section.querySelector(".lpb-orbit-return"),
      ].filter(Boolean);

      gsap.to(exitItems, {
        autoAlpha: 0,
        y: 16,
        scale: 0.98,
        duration: 0.24,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          applyOrbitAngle(returnOrbitAngleRef.current, true);
          shouldAnimateOrbitReturn.current = true;
          modeRef.current = "orbit";
          setMode("orbit");
          updateSwitchingState(false);
        },
      });
    }, section);

    return () => context.revert();
  }, [applyOrbitAngle, mode, updateSwitchingState]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || mode !== "orbit" || !shouldAnimateOrbitReturn.current || reduceMotionRef.current) return undefined;

    shouldAnimateOrbitReturn.current = false;

    const context = gsap.context(() => {
      const returnItems = [
        section.querySelector(".lpb-drag-hint"),
        section.querySelector(".lpb-mobile-orbit-stage"),
        ...Array.from(section.querySelectorAll(".lpb-orbit-card")),
      ].filter(Boolean);

      if (returnItems.length === 0) {
        startAutoOrbit();
        return;
      }

      gsap.fromTo(
        returnItems,
        { autoAlpha: 0, y: 10, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          stagger: 0.025,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          onComplete: startAutoOrbit,
        },
      );
    }, section);

    return () => context.revert();
  }, [mode, startAutoOrbit]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mount = section.closest(".linka-portfolio-mount") ?? section;
    const introItems = [
      mount.querySelector(".linka-portfolio-kicker"),
      mount.querySelector(".linka-portfolio-intro h2"),
      mount.querySelector(".linka-portfolio-intro p"),
    ].filter(Boolean);
    const dragHint = section.querySelector(".lpb-drag-hint");
    const orbitCards = Array.from(section.querySelectorAll(".lpb-orbit-card"));
    const mobileOrbitItems = Array.from(section.querySelectorAll(".lpb-mobile-orbit-stage, .lpb-mobile-orbit-card"));
    const glow = section.querySelector(".lpb-glow");
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if (reduceMotionRef.current) {
      gsap.set([...introItems, dragHint, ...orbitCards, ...mobileOrbitItems, glow].filter(Boolean), {
        autoAlpha: 1,
        clearProps: "filter,opacity,visibility,transform",
      });
      return undefined;
    }

    let context: gsap.Context | null = null;

    if (isMobileViewport) {
      gsap.set([...introItems, dragHint, ...mobileOrbitItems, glow].filter(Boolean), {
        autoAlpha: 1,
        clearProps: "filter,opacity,visibility,transform",
      });
    } else {
      context = gsap.context(() => {
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
          );

        if (dragHint) {
          timeline.fromTo(
            dragHint,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.42, clearProps: "opacity,visibility,transform" },
            "-=0.2",
          );
        }

        if (orbitCards.length > 0) {
          timeline.fromTo(
            orbitCards,
            { autoAlpha: 0, filter: "blur(8px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.74, stagger: { each: 0.06, from: "center" }, clearProps: "opacity,visibility,filter" },
            "-=0.18",
          );
        }

        const glowTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: mount,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        });

        if (glow) {
          glowTimeline.to(glow, { y: 18, scale: 1.035, opacity: 0.78, ease: "none" }, 0);
        }
      }, section);
    }

    startAutoOrbit();

    return () => {
      stopAutoOrbit();

      if (snapOrbitTween.current) {
        snapOrbitTween.current.kill();
        snapOrbitTween.current = null;
      }

      if (orbitFrame.current !== null) {
        window.cancelAnimationFrame(orbitFrame.current);
        orbitFrame.current = null;
      }

      context?.revert();
    };
  }, [startAutoOrbit, stopAutoOrbit]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || reduceMotionRef.current || mode !== "focus") return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".lpb-device-stage",
        { autoAlpha: 0, y: 34, scale: 0.965, filter: "blur(6px)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.64, ease: "power3.out", clearProps: "opacity,visibility,transform,filter" },
      );
      gsap.fromTo(
        ".lpb-phone",
        { autoAlpha: 0, x: 26, y: 16, scale: 0.94 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.52, ease: "power3.out", clearProps: "opacity,visibility,transform" },
      );
      gsap.fromTo(
        ".lpb-project-meta",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.44, ease: "power3.out", clearProps: "opacity,visibility,transform" },
      );
      gsap.fromTo(
        ".lpb-orbit-return",
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.36, ease: "power3.out", clearProps: "opacity,visibility,transform" },
      );
    }, section);

    return () => context.revert();
  }, [activeIndex, mode]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const section = sectionRef.current;
      if (!section) return;
      if (!section.matches(":hover") && !section.contains(document.activeElement)) return;
      if (modeRef.current !== "orbit") return;

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

      clearAutoOrbitResume();
    };
  }, [clearAutoOrbitResume]);

  return (
    <section className={`lpb-section is-${mode}`} aria-label="Portfolio visual de projetos" ref={sectionRef} tabIndex={0}>
      <div className="lpb-shell">
        <div className="lpb-glow" aria-hidden="true" />

        {mode === "orbit" ? (
          <div className={hasInteracted ? "lpb-drag-hint is-muted" : "lpb-drag-hint"}>GIRE PARA EXPLORAR</div>
        ) : null}

        <div
          className={isSwitching ? `lpb-gallery is-${mode} is-switching` : `lpb-gallery is-${mode}`}
          aria-live="polite"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {showsOrbit ? (
            isCompact ? (
              <div className="lpb-mobile-orbit-stage" aria-label="Escolha um projeto" ref={mobileOrbitStageRef}>
                <div
                  className="lpb-mobile-orbit-ring"
                  ref={mobileOrbitRingRef}
                  style={{ "--lpb-mobile-ring-angle": `${orbitAngle.toFixed(2)}deg` } as CSSProperties}
                >
                  {projects.map((project, index) => {
                    const isSelected = index === activeIndex;

                    return (
                      <button
                        type="button"
                        className={isSelected ? "lpb-mobile-orbit-card is-selected" : "lpb-mobile-orbit-card"}
                        data-index={index}
                        data-project={project.id}
                        disabled={mode === "opening"}
                        style={{ "--lpb-mobile-slot-angle": `${(index * ORBIT_STEP).toFixed(2)}deg` } as CSSProperties}
                        aria-label={`Abrir projeto ${project.name}`}
                        key={project.id}
                        onClick={() => selectProject(index)}
                      >
                        {renderOrbitMockup(project)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="lpb-orbit" aria-label="Escolha um projeto">
                {projects.map((project, index) => {
                  const pose = getProjectPose(index, activeIndex, orbitAngle, mode, isCompact);
                  const isSelected = index === activeIndex;

                  return (
                    <button
                      type="button"
                      className={isSelected ? "lpb-orbit-card is-selected" : "lpb-orbit-card"}
                      data-index={index}
                      data-project={project.id}
                      disabled={mode === "opening"}
                      style={getPoseStyle(pose)}
                      aria-label={`Abrir projeto ${project.name}`}
                      key={project.id}
                      ref={(card) => {
                        orbitCardRefs.current[index] = card;
                      }}
                      onClick={() => selectProject(index)}
                    >
                      {renderOrbitMockup(project)}
                    </button>
                  );
                })}
              </div>
            )
          ) : null}

          {showsProject ? (
            <article className="lpb-project-layer is-active" key={activeProject.id}>
              <div className="lpb-device-stage">
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
              </div>
            </article>
          ) : null}
        </div>

        {showsProject ? (
          <>
            <div className="lpb-project-meta" key={`${activeProject.id}-meta`}>
              <strong>{activeProject.displayTitle}</strong>
            </div>

            <button type="button" className="lpb-orbit-return" onClick={returnToOrbit}>
              Voltar à órbita
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}
