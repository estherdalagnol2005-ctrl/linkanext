"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MutableRefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

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
    displayTitle: "Landing Page de Conversão — Nutrição",
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
    displayTitle: "Landing Page — Quatorze",
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
const VIDEO_START_TIME = 0.8;
const VIDEO_LOOP_THRESHOLD = 0.18;

gsap.registerPlugin(ScrollTrigger);

function wrapIndex(index: number) {
  return (index + projects.length) % projects.length;
}

function getDisplayTitleParts(displayTitle: string) {
  const [titleType, ...brandParts] = displayTitle.split(" — ");

  return {
    titleType,
    titleBrand: brandParts.join(" — "),
  };
}

type TransitionDirection = -1 | 1;

type TransitionRequest = {
  direction: TransitionDirection;
  index: number;
  token: number;
};

type ViewportMode = "desktop" | "mobile";
type VideoSlot = 0 | 1;
type VideoChannel = "desktop" | "mobile";
type VideoSlotSources = [string, string];
type PreparedVideoChannel = {
  currentVideo: HTMLVideoElement;
  incomingSlot: VideoSlot;
  incomingVideo: HTMLVideoElement;
};
type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: (now: number, metadata: unknown) => void) => number;
};

export default function PortfolioBuildPrototype() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLElement>(null);
  const desktopVideoSlotsRef = useRef<Array<HTMLVideoElement | null>>([null, null]);
  const mobileVideoSlotsRef = useRef<Array<HTMLVideoElement | null>>([null, null]);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const transitionTokenRef = useRef(0);
  const requestedIndexRef = useRef(0);
  const displayedIndexRef = useRef(0);
  const pendingVideoCleanupsRef = useRef<Set<() => void>>(new Set());
  const preloadedVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const activeDesktopSlotRef = useRef<VideoSlot>(0);
  const activeMobileSlotRef = useRef<VideoSlot>(0);
  const desktopSlotSourcesRef = useRef<VideoSlotSources>([projects[0].desktopVideo, ""]);
  const mobileSlotSourcesRef = useRef<VideoSlotSources>([projects[0].mobileVideo, ""]);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragLastX = useRef(0);
  const dragLastTime = useRef(0);
  const dragVelocityX = useRef(0);
  const dragIsHorizontal = useRef(false);
  const dragAbandoned = useRef(false);
  const dragPointerId = useRef<number | null>(null);
  const dragCaptured = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [titleIndex, setTitleIndex] = useState(0);
  const [transitionRequest, setTransitionRequest] = useState<TransitionRequest | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const titleProject = projects[titleIndex];
  const displayTitleParts = getDisplayTitleParts(titleProject.displayTitle);

  function playVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    return video.play().then(
      () => true,
      () => true,
    );
  }

  function getSafeStartTime(video: HTMLVideoElement) {
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return VIDEO_START_TIME;
    }

    return Math.min(VIDEO_START_TIME, Math.max(0, video.duration - 0.2));
  }

  function handleControlledLoop(video: HTMLVideoElement) {
    if (!Number.isFinite(video.duration) || video.duration <= VIDEO_START_TIME + 0.2) return;
    if (!video.ended && video.currentTime < video.duration - VIDEO_LOOP_THRESHOLD) return;

    video.currentTime = getSafeStartTime(video);
    void playVideo(video);
  }

  function updateVideoSlotState(currentVideo: HTMLVideoElement, incomingVideo: HTMLVideoElement) {
    currentVideo.classList.add("is-current");
    currentVideo.classList.remove("is-incoming");
    incomingVideo.classList.add("is-incoming");
    incomingVideo.classList.remove("is-current");
  }

  function clearPendingVideoWaits() {
    pendingVideoCleanupsRef.current.forEach((cleanup) => cleanup());
    pendingVideoCleanupsRef.current.clear();
  }

  function waitForVideoEvent(video: HTMLVideoElement, events: string[], token: number) {
    if (transitionTokenRef.current !== token) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      let settled = false;
      const timeoutId = window.setTimeout(() => finish(false), 9000);
      const cancel = () => finish(false);
      const cleanup = () => {
        window.clearTimeout(timeoutId);
        events.forEach((eventName) => video.removeEventListener(eventName, handleReady));
        video.removeEventListener("error", handleError);
        pendingVideoCleanupsRef.current.delete(cancel);
      };
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(result);
      };
      const handleReady = () => finish(transitionTokenRef.current === token);
      const handleError = () => finish(false);

      events.forEach((eventName) => video.addEventListener(eventName, handleReady, { once: true }));
      video.addEventListener("error", handleError, { once: true });
      pendingVideoCleanupsRef.current.add(cancel);
    });
  }

  const waitForRenderedFrame = useCallback((video: HTMLVideoElement, token: number) => {
    if (transitionTokenRef.current !== token) {
      return Promise.resolve(false);
    }

    const videoWithFrameCallback: VideoWithFrameCallback = video;
    if (typeof videoWithFrameCallback.requestVideoFrameCallback === "function") {
      return new Promise<boolean>((resolve) => {
        const timeoutId = window.setTimeout(() => {
          resolve(transitionTokenRef.current === token && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
        }, 700);

        videoWithFrameCallback.requestVideoFrameCallback(() => {
          window.clearTimeout(timeoutId);
          resolve(transitionTokenRef.current === token);
        });
      });
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      return Promise.resolve(true);
    }

    return waitForVideoEvent(video, ["loadeddata", "canplay"], token);
  }, []);

  const prepareVideoSlot = useCallback(async (
    video: HTMLVideoElement,
    src: string,
    loadedSources: MutableRefObject<VideoSlotSources>,
    slot: VideoSlot,
    token: number,
    label: string,
  ) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("aria-label", label);

    if (loadedSources.current[slot] !== src) {
      video.pause();
      loadedSources.current[slot] = src;
      video.src = src;
      video.load();
    }

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      const hasMetadata = await waitForVideoEvent(video, ["loadedmetadata"], token);
      if (!hasMetadata || transitionTokenRef.current !== token) return false;
    }

    const startTime = getSafeStartTime(video);
    if (Math.abs(video.currentTime - startTime) > 0.04) {
      const seekPromise = waitForVideoEvent(video, ["seeked", "loadeddata", "canplay"], token);
      video.currentTime = startTime;
      const seeked = await seekPromise;
      if (!seeked || transitionTokenRef.current !== token) return false;
    }

    await playVideo(video);
    return waitForRenderedFrame(video, token);
  }, [waitForRenderedFrame]);

  const preloadVideoUrl = useCallback((src: string) => {
    if (preloadedVideosRef.current.has(src)) return;

    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = src;
    preloadedVideosRef.current.set(src, video);
    video.load();
  }, []);

  const preloadProjectNeighbors = useCallback((projectIndex: number) => {
    [wrapIndex(projectIndex + 1), wrapIndex(projectIndex - 1)].forEach((neighborIndex) => {
      const project = projects[neighborIndex];
      preloadVideoUrl(project.desktopVideo);
      preloadVideoUrl(project.mobileVideo);
    });
  }, [preloadVideoUrl]);

  const setActiveSlotRef = useCallback((channel: VideoChannel, slot: VideoSlot) => {
    if (channel === "desktop") {
      activeDesktopSlotRef.current = slot;
    } else {
      activeMobileSlotRef.current = slot;
    }
  }, []);

  const normalizeVisibleSlots = useCallback(() => {
    ([
      ["desktop", desktopVideoSlotsRef, activeDesktopSlotRef.current],
      ["mobile", mobileVideoSlotsRef, activeMobileSlotRef.current],
    ] as const).forEach(([, slotsRef, activeSlot]) => {
      const hiddenSlot = (activeSlot === 0 ? 1 : 0) as VideoSlot;
      const activeVideo = slotsRef.current[activeSlot];
      const hiddenVideo = slotsRef.current[hiddenSlot];

      if (activeVideo) {
        gsap.set(activeVideo, { opacity: 1, visibility: "visible", x: 0 });
      }

      if (hiddenVideo) {
        hiddenVideo.pause();
        gsap.set(hiddenVideo, { opacity: 0, visibility: "visible", x: 0 });
      }

      if (activeVideo && hiddenVideo) {
        updateVideoSlotState(activeVideo, hiddenVideo);
      }
    });

    gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
  }, []);

  const requestProject = useCallback((projectIndex: number, direction: TransitionDirection) => {
    const nextIndex = wrapIndex(projectIndex);
    if (nextIndex === requestedIndexRef.current) return;

    transitionTimelineRef.current?.kill();
    transitionTimelineRef.current = null;
    clearPendingVideoWaits();
    normalizeVisibleSlots();
    transitionTokenRef.current += 1;
    requestedIndexRef.current = nextIndex;
    setHasInteracted(true);
    setTransitionRequest({ index: nextIndex, direction, token: transitionTokenRef.current });
  }, [normalizeVisibleSlots]);

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
    const incomingOffset = direction * 8;
    const outgoingOffset = direction * -8;
    let disposed = false;
    let committed = false;

    const buildChannel = (channel: VideoChannel): PreparedVideoChannel | null => {
      const isDesktop = channel === "desktop";
      const activeSlot = isDesktop ? activeDesktopSlotRef.current : activeMobileSlotRef.current;
      const incomingSlot = (activeSlot === 0 ? 1 : 0) as VideoSlot;
      const slotsRef = isDesktop ? desktopVideoSlotsRef : mobileVideoSlotsRef;
      const currentVideo = slotsRef.current[activeSlot];
      const incomingVideo = slotsRef.current[incomingSlot];

      if (!currentVideo || !incomingVideo) {
        return null;
      }

      gsap.set(currentVideo, { opacity: 1, visibility: "visible", x: 0 });
      gsap.set(incomingVideo, { opacity: 0, visibility: "visible", x: incomingOffset });
      updateVideoSlotState(currentVideo, incomingVideo);

      return { currentVideo, incomingSlot, incomingVideo };
    };

    const prepareChannel = (
      channel: VideoChannel,
      preparedChannel: PreparedVideoChannel,
    ) => {
      const isDesktop = channel === "desktop";
      const sourcesRef = isDesktop ? desktopSlotSourcesRef : mobileSlotSourcesRef;
      const project = projects[index];
      const nextSrc = isDesktop ? project.desktopVideo : project.mobileVideo;
      const label = `Projeto ${project.name} no ${isDesktop ? "notebook" : "celular"}`;

      return prepareVideoSlot(
        preparedChannel.incomingVideo,
        nextSrc,
        sourcesRef,
        preparedChannel.incomingSlot,
        token,
        label,
      );
    };

    const commitDisplayedProject = (
      desktopChannel: PreparedVideoChannel,
      mobileChannel: PreparedVideoChannel,
    ) => {
      if (committed || transitionTokenRef.current !== token) return;
      committed = true;

      setActiveSlotRef("desktop", desktopChannel.incomingSlot);
      setActiveSlotRef("mobile", mobileChannel.incomingSlot);
      displayedIndexRef.current = index;
      requestedIndexRef.current = index;

      flushSync(() => {
        setSelectedIndex(index);
        setTitleIndex(index);
      });
    };

    const failSafely = (desktopChannel: PreparedVideoChannel | null, mobileChannel: PreparedVideoChannel | null) => {
      if (transitionTokenRef.current !== token) return;

      [desktopChannel, mobileChannel].forEach((channel) => {
        if (!channel) return;
        channel.incomingVideo.pause();
        gsap.set(channel.currentVideo, { opacity: 1, visibility: "visible", x: 0 });
        gsap.set(channel.incomingVideo, { opacity: 0, visibility: "visible", x: 0 });
        updateVideoSlotState(channel.currentVideo, channel.incomingVideo);
      });

      gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
      requestedIndexRef.current = displayedIndexRef.current;
      setTransitionRequest(null);
    };

    const runTransition = async () => {
      const desktopChannel = buildChannel("desktop");
      const mobileChannel = buildChannel("mobile");

      if (!desktopChannel || !mobileChannel) {
        failSafely(desktopChannel, mobileChannel);
        return;
      }

      const [desktopReady, mobileReady] = await Promise.all([
        prepareChannel("desktop", desktopChannel),
        prepareChannel("mobile", mobileChannel),
      ]);

      if (disposed || transitionTokenRef.current !== token) return;

      if (!desktopReady || !mobileReady) {
        failSafely(desktopChannel, mobileChannel);
        return;
      }

      if (reduceMotion) {
        gsap.set(desktopChannel.currentVideo, { opacity: 0, visibility: "visible", x: 0 });
        gsap.set(desktopChannel.incomingVideo, { opacity: 1, visibility: "visible", x: 0 });
        gsap.set(mobileChannel.currentVideo, { opacity: 0, visibility: "visible", x: 0 });
        gsap.set(mobileChannel.incomingVideo, { opacity: 1, visibility: "visible", x: 0 });
        commitDisplayedProject(desktopChannel, mobileChannel);
        desktopChannel.currentVideo.pause();
        mobileChannel.currentVideo.pause();
        updateVideoSlotState(desktopChannel.incomingVideo, desktopChannel.currentVideo);
        updateVideoSlotState(mobileChannel.incomingVideo, mobileChannel.currentVideo);
        setTransitionRequest(null);
        preloadProjectNeighbors(index);
        return;
      }

      const midpoint = VIDEO_TRANSITION_DURATION / 2;
      transitionTimelineRef.current?.kill();
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          if (transitionTokenRef.current !== token) return;

          desktopChannel.currentVideo.pause();
          mobileChannel.currentVideo.pause();
          gsap.set(desktopChannel.currentVideo, { opacity: 0, visibility: "visible", x: 0 });
          gsap.set(mobileChannel.currentVideo, { opacity: 0, visibility: "visible", x: 0 });
          updateVideoSlotState(desktopChannel.incomingVideo, desktopChannel.currentVideo);
          updateVideoSlotState(mobileChannel.incomingVideo, mobileChannel.currentVideo);
          setTransitionRequest(null);
          preloadProjectNeighbors(index);
        },
      });

      transitionTimelineRef.current = timeline;

      timeline
        .to(desktopChannel.currentVideo, { opacity: 0, x: outgoingOffset, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(desktopChannel.incomingVideo, { opacity: 1, x: 0, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(mobileChannel.currentVideo, { opacity: 0, x: outgoingOffset, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(mobileChannel.incomingVideo, { opacity: 1, x: 0, duration: VIDEO_TRANSITION_DURATION }, 0)
        .to(titleRef.current, { autoAlpha: 0, y: direction * -6, duration: midpoint }, 0)
        .call(() => commitDisplayedProject(desktopChannel, mobileChannel), undefined, midpoint)
        .fromTo(
          titleRef.current,
          { autoAlpha: 0, y: direction * 6 },
          { autoAlpha: 1, y: 0, duration: midpoint },
          midpoint,
        );
    };

    void runTransition();

    return () => {
      disposed = true;
    };
  }, [prepareVideoSlot, preloadProjectNeighbors, setActiveSlotRef, transitionRequest]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewportMode = () => setViewportMode(mediaQuery.matches ? "mobile" : "desktop");

    syncViewportMode();
    mediaQuery.addEventListener("change", syncViewportMode);

    return () => mediaQuery.removeEventListener("change", syncViewportMode);
  }, []);

  useLayoutEffect(() => {
    const desktopActive = desktopVideoSlotsRef.current[0];
    const desktopHidden = desktopVideoSlotsRef.current[1];
    const mobileActive = mobileVideoSlotsRef.current[0];
    const mobileHidden = mobileVideoSlotsRef.current[1];
    const project = projects[0];

    [desktopActive, desktopHidden, mobileActive, mobileHidden].forEach((video) => {
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    });

    if (desktopActive) {
      desktopActive.src = project.desktopVideo;
      desktopSlotSourcesRef.current[0] = project.desktopVideo;
      desktopActive.setAttribute("aria-label", `Projeto ${project.name} no notebook`);
      gsap.set(desktopActive, { opacity: 1, visibility: "visible", x: 0 });
    }

    if (mobileActive) {
      mobileActive.src = project.mobileVideo;
      mobileSlotSourcesRef.current[0] = project.mobileVideo;
      mobileActive.setAttribute("aria-label", `Projeto ${project.name} no celular`);
      gsap.set(mobileActive, { opacity: 1, visibility: "visible", x: 0 });
    }

    [desktopHidden, mobileHidden].forEach((video) => {
      if (!video) return;
      gsap.set(video, { opacity: 0, visibility: "visible", x: 0 });
    });

    if (desktopActive && desktopHidden) {
      updateVideoSlotState(desktopActive, desktopHidden);
    }
    if (mobileActive && mobileHidden) {
      updateVideoSlotState(mobileActive, mobileHidden);
    }

    const token = transitionTokenRef.current;
    void Promise.all([
      desktopActive
        ? prepareVideoSlot(desktopActive, project.desktopVideo, desktopSlotSourcesRef, 0, token, `Projeto ${project.name} no notebook`)
        : Promise.resolve(false),
      mobileActive
        ? prepareVideoSlot(mobileActive, project.mobileVideo, mobileSlotSourcesRef, 0, token, `Projeto ${project.name} no celular`)
        : Promise.resolve(false),
    ]).then(() => preloadProjectNeighbors(0));
  }, [prepareVideoSlot, preloadProjectNeighbors]);

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
      clearPendingVideoWaits();
      transitionTimelineRef.current?.kill();
      preloadedVideosRef.current.forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
      });
      preloadedVideosRef.current.clear();
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
                      className="lpb-project-video lpb-video-slot-a is-current"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      aria-label={`Projeto ${projects[0].name} no notebook`}
                      ref={(video) => {
                        desktopVideoSlotsRef.current[0] = video;
                      }}
                      onTimeUpdate={(event) => handleControlledLoop(event.currentTarget)}
                      onEnded={(event) => handleControlledLoop(event.currentTarget)}
                    />
                    <video
                      className="lpb-project-video lpb-video-slot-b is-incoming"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Proximo projeto no notebook"
                      ref={(video) => {
                        desktopVideoSlotsRef.current[1] = video;
                      }}
                      onTimeUpdate={(event) => handleControlledLoop(event.currentTarget)}
                      onEnded={(event) => handleControlledLoop(event.currentTarget)}
                    />
                  </div>
                </div>
                <div className="lpb-notebook-base" />
              </div>

              <div className="lpb-phone">
                <div className="lpb-phone-screen">
                  <div className="lpb-phone-notch" />
                  <div className="lpb-video-stack">
                    <video
                      className="lpb-project-video lpb-video-slot-a is-current"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      aria-label={`Projeto ${projects[0].name} no celular`}
                      ref={(video) => {
                        mobileVideoSlotsRef.current[0] = video;
                      }}
                      onTimeUpdate={(event) => handleControlledLoop(event.currentTarget)}
                      onEnded={(event) => handleControlledLoop(event.currentTarget)}
                    />
                    <video
                      className="lpb-project-video lpb-video-slot-b is-incoming"
                      autoPlay
                      muted
                      playsInline
                      preload="auto"
                      aria-label="Proximo projeto no celular"
                      ref={(video) => {
                        mobileVideoSlotsRef.current[1] = video;
                      }}
                      onTimeUpdate={(event) => handleControlledLoop(event.currentTarget)}
                      onEnded={(event) => handleControlledLoop(event.currentTarget)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="lpb-project-meta">
          <strong className="lpb-project-title" ref={titleRef}>
            <span className="lpb-project-title-type">{displayTitleParts.titleType}</span>
            <span className="lpb-project-title-separator"> — </span>
            <span className="lpb-project-title-brand">{displayTitleParts.titleBrand}</span>
          </strong>
          <span className="lpb-counter" aria-label={`${titleIndex + 1} de ${projects.length}`}>
            <span className="lpb-counter-current">{String(titleIndex + 1).padStart(2, "0")}</span>
            <span className="lpb-counter-separator">/</span>
            <span className="lpb-counter-total">{String(projects.length).padStart(2, "0")}</span>
          </span>
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
