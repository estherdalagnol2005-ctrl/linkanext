import { readFile } from "node:fs/promises";
import path from "node:path";

import FunctionalReference from "./functional-reference";

function replaceRequired(source: string, search: string | RegExp, replacement: string) {
  const nextSource = source.replace(search, replacement);

  if (nextSource === source) {
    throw new Error(`Trecho de controle de video nao encontrado: ${String(search)}`);
  }

  return nextSource;
}

function adaptPortfolioBehavior(source: string) {
  let script = source;

  script = replaceRequired(script, "  (function () {", "  return (function () {");
  script = replaceRequired(
    script,
    "      var orientationRefreshTimer = null;",
    `      var orientationRefreshTimer = null;
      var cleanupController = new AbortController();
      var heroObserver = null;
      var introTween = null;
      var refreshFrame = null;
      var preparedVideos = new WeakSet();
      var videoLoadPromises = new WeakMap();
      var videoPlayPromises = new WeakMap();
      var videosThatShouldPlay = new WeakSet();
      var savedMainVideoTimes = new WeakMap();
      var defaultMainSources = new WeakMap();
      var interactionTimers = [];
      var isDisposed = false;
      var choicePanel = hero.querySelector(".linka-choice-content");
      var choiceIntroItems = choicePanel
        ? Array.prototype.slice.call(choicePanel.querySelectorAll(".escolha-projeto, .titulo-principal"))
        : [];
      var choiceIntroTimeline = null;
      var choiceIntroPlayed = false;

      function listen(target, type, handler, options) {
        var listenerOptions = typeof options === "boolean"
          ? { capture: options, signal: cleanupController.signal }
          : Object.assign({}, options || {}, { signal: cleanupController.signal });

        target.addEventListener(type, handler, listenerOptions);
      }

      function scheduleInteraction(callback, delay) {
        var timer = window.setTimeout(callback, delay);
        interactionTimers.push(timer);
      }

      function lockChoiceCardsLayout() {
        currentChoiceCards.forEach(function (cardData) {
          if (!cardData.element) return;

          cardData.element.dataset.revealed = "true";
          cardData.element.classList.add("is-choice-ready");

          if (!window.gsap) return;

          gsap.set(cardData.element, {
            x: cardData.choiceX,
            y: cardData.choiceY,
            z: cardData.choiceZ,
            scale: cardData.choiceScale,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            autoAlpha: 1
          });
        });
      }`,
  );
  script = replaceRequired(
    script,
    /      function prepareVideo\(video\) \{[\s\S]*?\n      function setChoiceCardsInteractive/,
    `      function prepareVideo(video) {
        if (video.classList.contains("linka-main-video") && !defaultMainSources.has(video)) {
          defaultMainSources.set(video, video.getAttribute("data-src") || video.getAttribute("src"));
        }

        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.setAttribute("loop", "");
        video.setAttribute("preload", "auto");
        video.setAttribute("disablepictureinpicture", "");
        video.setAttribute("controlslist", "nodownload noplaybackrate nofullscreen");
        video.removeAttribute("controls");

        if (!preparedVideos.has(video)) {
          preparedVideos.add(video);
          listen(video, "loadeddata", function () { setVideoReady(video); });
          listen(video, "playing", function () { setVideoReady(video); });
          listen(video, "canplay", function () {
            if (videosThatShouldPlay.has(video) && !document.hidden) playVideo(video);
          });
          listen(video, "seeked", function () {
            if (videosThatShouldPlay.has(video) && !document.hidden) playVideo(video);
          });
        }

        video.autoplay = true;
        video.setAttribute("autoplay", "");
      }

      function setVideoReady(video) {
        video.classList.add("is-ready");
        if (video.parentElement) video.parentElement.classList.add("is-video-ready");
      }

      function getDefaultMainSource(video) {
        return video ? defaultMainSources.get(video) || "" : "";
      }

      function playChoiceIntro() {
        if (choiceIntroPlayed || !choicePanel || !window.gsap) return;
        choiceIntroPlayed = true;

        choiceIntroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        choiceIntroTimeline.fromTo(choicePanel, {
          autoAlpha: 0,
          "--linka-choice-entry-y": "18px",
          "--linka-choice-entry-scale": 0.97
        }, {
          autoAlpha: 1,
          "--linka-choice-entry-y": "0px",
          "--linka-choice-entry-scale": 1,
          duration: 0.9
        }, 0);
        choiceIntroTimeline.fromTo(choiceIntroItems, {
          autoAlpha: 0,
          y: 10
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          stagger: 0.1
        }, 0.08);
      }

      function loadVideo(video) {
        if (!video) return Promise.resolve(null);

        prepareVideo(video);

        if (video.readyState >= 2) {
          setVideoReady(video);
          return Promise.resolve(video);
        }

        if (videoLoadPromises.has(video)) return videoLoadPromises.get(video);

        var loadPromise = new Promise(function (resolve) {
          var source = video.getAttribute("data-src");
          var settled = false;

          function cleanupReadyListeners() {
            video.removeEventListener("loadeddata", finish);
            video.removeEventListener("canplay", finish);
            video.removeEventListener("error", fail);
          }

          function finish() {
            if (settled) return;
            settled = true;
            cleanupReadyListeners();
            setVideoReady(video);
            videoLoadPromises.delete(video);
            resolve(video);
          }

          function fail() {
            if (settled) return;
            settled = true;
            cleanupReadyListeners();
            videoLoadPromises.delete(video);
            resolve(null);
          }

          listen(video, "loadeddata", finish);
          listen(video, "canplay", finish);
          listen(video, "error", fail);

          if (!video.getAttribute("src") && source) video.setAttribute("src", source);
          else if (!video.getAttribute("src")) fail();
        });

        videoLoadPromises.set(video, loadPromise);
        return loadPromise;
      }

      function unloadVideo(video) {
        pauseVideo(video);
      }

      function playVideo(video) {
        if (!video || isDisposed) return Promise.resolve(false);
        videosThatShouldPlay.add(video);
        prepareVideo(video);
        loadVideo(video);

        if (isDisposed || !video.getAttribute("src") || document.hidden) return Promise.resolve(false);
        if (!video.paused) return Promise.resolve(true);
        if (videoPlayPromises.has(video)) return videoPlayPromises.get(video);

        var playPromise;
        try {
          playPromise = video.play();
        } catch (error) {
          return Promise.resolve(false);
        }

        var trackedPromise = Promise.resolve(playPromise).then(function () {
          videoPlayPromises.delete(video);
          return true;
        }).catch(function () {
          videoPlayPromises.delete(video);
          return false;
        });
        videoPlayPromises.set(video, trackedPromise);
        return trackedPromise;
      }

      function pauseVideo(video) {
        if (!video) return;
        videosThatShouldPlay.delete(video);
        videoPlayPromises.delete(video);
        if (!video.paused) video.pause();
      }

      allVideos.forEach(prepareVideo);

      function isMobileVideo(video) {
        return Boolean(video.closest(".linka-phone-device, .linka-card-mobile"));
      }

      function startActiveCardVideos() {
        if (isDisposed || document.hidden || !activeCardVideos.length) return Promise.resolve(false);
        return Promise.all(activeCardVideos.map(function (video) { return playVideo(video); }));
      }

      function updateActiveVideos() {
        var useMobile = mobileQuery.matches;

        activeMainVideos = mainVideos.filter(function (video) {
          return isMobileVideo(video) === useMobile;
        });
        activeCardVideos = cardVideos.filter(function (video) {
          return isMobileVideo(video) === useMobile;
        });

        allVideos.forEach(function (video) {
          var isActive = activeMainVideos.indexOf(video) !== -1 || activeCardVideos.indexOf(video) !== -1;
          if (!isActive) unloadVideo(video);
        });

        startActiveCardVideos();
        activeMainVideos.forEach(function (video) {
          loadVideo(video).then(function () {
            if (heroIsVisible && !document.hidden && portfolioState === "scroll") playVideo(video);
          });
        });
      }

      function playChoiceVideos() {
        startActiveCardVideos();
      }

      function playVisibleVideos() {
        if (document.hidden) return;

        startActiveCardVideos();

        if (!heroIsVisible) return;

        if (portfolioState === "scroll") {
          activeMainVideos.forEach(function (video) { playVideo(video); });
          return;
        }

        if (portfolioState === "choice") {
          activeMainVideos.forEach(function (video) { pauseVideo(video); });
          playChoiceVideos();
          return;
        }

        if (portfolioState === "open" && selectedDeviceVideo) {
          playVideo(selectedDeviceVideo);
        }
      }

      function pauseMainVideos() {
        activeMainVideos.forEach(function (video) { pauseVideo(video); });
      }

      function pauseAllActiveVideos() {
        activeMainVideos.concat(activeCardVideos).forEach(function (video) { pauseVideo(video); });
      }

      function pauseAndResetActiveMainVideos() {
        activeMainVideos.forEach(function (video) { pauseVideo(video); });
      }

      function playActiveMainVideosFromStart() {
        activeMainVideos.forEach(function (video) { playVideo(video); });
      }

      function setDeviceVideo(mainVideo, source, shouldPlay) {
        if (!mainVideo || !source) return;
        if (shouldPlay !== false) shouldPlay = true;

        pauseVideo(mainVideo);
        prepareVideo(mainVideo);

        if (mainVideo.getAttribute("src") !== source) {
          videoLoadPromises.delete(mainVideo);
          videoPlayPromises.delete(mainVideo);
          mainVideo.classList.remove("is-ready");
          if (mainVideo.parentElement) mainVideo.parentElement.classList.remove("is-video-ready");
          mainVideo.setAttribute("data-src", source);
          mainVideo.setAttribute("src", source);

          var defaultSource = getDefaultMainSource(mainVideo);
          var savedTime = savedMainVideoTimes.get(mainVideo);
          if (source === defaultSource && typeof savedTime === "number" && savedTime > 0) {
            listen(mainVideo, "loadedmetadata", function () {
              if (mainVideo.duration && savedTime < mainVideo.duration) mainVideo.currentTime = savedTime;
            }, { once: true });
          }
        }

        loadVideo(mainVideo).then(function (loadedVideo) {
          if (!loadedVideo) return;
          if (shouldPlay) playVideo(loadedVideo);
          else pauseVideo(loadedVideo);
        });
      }

      function setChoiceCardsInteractive`,
  );
  script = replaceRequired(
    script,
    `      function pauseAndResetChoiceVideos() {
        currentChoiceCards.forEach(function (cardData) {
          pauseVideo(cardData.video, true);
        });
      }`,
    "",
  );
  script = replaceRequired(
    script,
    `        var defaultSource = openedVideo ? openedVideo.getAttribute("data-default-src") : "";`,
    `        var defaultSource = getDefaultMainSource(openedVideo);`,
  );
  script = replaceRequired(
    script,
    `        var defaultSource = selectedDeviceVideo.getAttribute("data-default-src");`,
    `        var defaultSource = getDefaultMainSource(selectedDeviceVideo);`,
  );
  script = replaceRequired(
    script,
    "        setChoiceCardsInteractive(true);\n        pauseAndResetChoiceVideos();\n        pauseAndResetActiveMainVideos();",
    "        lockChoiceCardsLayout();\n        setChoiceCardsInteractive(true);\n        playChoiceIntro();\n        playChoiceVideos();\n        pauseAndResetActiveMainVideos();",
  );
  script = replaceRequired(
    script,
    "        setChoiceCardsInteractive(true);\n        pauseAndResetChoiceVideos();\n        pauseAndResetActiveMainVideos();",
    "        lockChoiceCardsLayout();\n        setChoiceCardsInteractive(true);\n        playChoiceIntro();\n        playChoiceVideos();\n        pauseAndResetActiveMainVideos();",
  );
  script = replaceRequired(
    script,
    `        activeCardVideos.forEach(function (video) {
          pauseVideo(video, true);
        });`,
    "",
  );
  script = replaceRequired(
    script,
    `      projectCards.forEach(function (card) {
        card.addEventListener("click", function () {
          openProject(card);
        });

        card.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject(card);
          }
        });
      });`,
    `      projectCards.forEach(function (card) {
        listen(card, "click", function () { openProject(card); });
        listen(card, "keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject(card);
          }
        });
      });`,
  );
  script = replaceRequired(
    script,
    `          window.setTimeout(function () {
            cardToFocus.focus({ preventScroll: true });
          }, 620);`,
    `          scheduleInteraction(function () {
            cardToFocus.focus({ preventScroll: true });
          }, 620);`,
  );
  script = replaceRequired(
    script,
    `        window.setTimeout(function () {
          var visibleReturn = hero.querySelector(".linka-device-return.is-visible");
          if (visibleReturn) visibleReturn.focus({ preventScroll: true });
        }, 640);`,
    `        scheduleInteraction(function () {
          var visibleReturn = hero.querySelector(".linka-device-return.is-visible");
          if (visibleReturn) visibleReturn.focus({ preventScroll: true });
        }, 640);`,
  );
  script = replaceRequired(
    script,
    `      Array.prototype.forEach.call(deviceReturnButtons, function (button) {
        button.addEventListener("click", restoreDeviceProject);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") restoreDeviceProject();
      });`,
    `      Array.prototype.forEach.call(deviceReturnButtons, function (button) {
        listen(button, "click", restoreDeviceProject);
      });

      listen(document, "keydown", function (event) {
        if (event.key === "Escape") restoreDeviceProject();
      });`,
  );
  script = replaceRequired(
    script,
    `      if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", function () {
          leaveChoiceState();
          updateActiveVideos();
          playVisibleVideos();
        });
      }`,
    `      if (typeof mobileQuery.addEventListener === "function") {
        listen(mobileQuery, "change", function () {
          leaveChoiceState();
          updateActiveVideos();
          playVisibleVideos();
        });
      }`,
  );
  script = replaceRequired(script, "      var heroObserver = new IntersectionObserver", "      heroObserver = new IntersectionObserver");
  script = replaceRequired(script, "      document.addEventListener(\"visibilitychange\", function () {", "      listen(document, \"visibilitychange\", function () {");
  script = replaceRequired(script, "      window.addEventListener(\"pagehide\", pauseActiveVideos);", "      listen(window, \"pagehide\", pauseAllActiveVideos);");
  script = script.replace(/\bpauseActiveVideos\b/g, "pauseMainVideos");
  script = replaceRequired(
    script,
    `        if (document.hidden) {
          pauseMainVideos();
        } else {`,
    `        if (document.hidden) {
          pauseAllActiveVideos();
        } else {`,
  );
  script = replaceRequired(script, "        window.addEventListener(\"pointerdown\", playVisibleVideos, { once: true, passive: true });", "        listen(window, \"pointerdown\", playVisibleVideos, { once: true, passive: true });");
  script = replaceRequired(script, "      window.addEventListener(\"orientationchange\", function () {", "      listen(window, \"orientationchange\", function () {");
  script = script.replace(/        gsap\.to\(stage, \{/g, "        introTween = gsap.to(stage, {");
  script = replaceRequired(
    script,
    `            onEnterBack: function () {
              if (timeline.time() >= choiceActivationTime) {
                enterChoiceState(cards);
              } else {
                leaveChoiceState();
              }
            },
            onUpdate: function () {
              if (timeline.time() >= choiceActivationTime) {
                enterChoiceState(cards);
              } else if (portfolioState !== "scroll") {
                leaveChoiceState();
              }
            },`,
    `            onEnterBack: function () {
              if (portfolioState !== "open" && timeline.time() >= choiceActivationTime) enterChoiceState(cards);
            },`,
  );
  script = replaceRequired(
    script,
    `            onLeave: function () {
              enterChoiceState(cards);
            },`,
    `            onLeave: function () {
              if (portfolioState !== "open") enterChoiceState(cards);
            },`,
  );
  script = replaceRequired(
    script,
    `            onLeaveBack: function () {
              leaveChoiceState();
              activeCardVideos.forEach(function (video) {
                var card = video.closest(".linka-card");
                if (card) {
                  card.dataset.revealed = "false";
                  card.classList.remove("is-interactive", "is-choice-ready");
                  card.setAttribute("tabindex", "-1");
                }
                pauseVideo(video, true);
              });
            }`,
    `            onLeaveBack: function () {
              if (portfolioState === "open") return;

              leaveChoiceState();
              activeCardVideos.forEach(function (video) {
                var card = video.closest(".linka-card");
                if (card) {
                  card.dataset.revealed = "false";
                  card.classList.remove("is-interactive", "is-choice-ready");
                  card.setAttribute("tabindex", "-1");
                }
                pauseVideo(video);
              });
            }`,
  );
  script = replaceRequired(
    script,
    `        selectedDeviceVideo = targetDevice;
        selectedCard = card;
        portfolioState = "open";`,
    `        selectedDeviceVideo = targetDevice;
        selectedCard = card;
        portfolioState = "open";
        savedMainVideoTimes.set(targetDevice, targetDevice.currentTime);`,
  );
  script = replaceRequired(
    script,
    `            onStart: function () {
              card.element.dataset.revealed = "true";
              playVideo(card.video, false);
            },`,
    `            onStart: function () {
              card.element.dataset.revealed = "true";
            },`,
  );
  script = replaceRequired(script, "              pauseVideo(card.video, true);", "");
  script = replaceRequired(script, "            pauseVideo(card.video, true);", "            pauseVideo(card.video);");
  script = replaceRequired(
    script,
    "        timeline.to(scrollCue, { autoAlpha: 0, duration: 0.9 }, choiceStart + 0.72);",
    `        timeline.call(function () {
          if (timeline.scrollTrigger && timeline.scrollTrigger.direction < 0) leaveChoiceState();
          else enterChoiceState(cards);
        }, null, choiceActivationTime);

        timeline.to(scrollCue, { autoAlpha: 0, duration: 0.9 }, choiceStart + 0.72);
        timeline.to({}, { duration: choiceHoldDuration }, choiceStart + 0.96);`,
  );
  script = replaceRequired(
    script,
    "        var choiceActivationTime = choiceStart + 0.66;",
    "        var choiceActivationTime = choiceStart + 0.72;\n        var choiceHoldDuration = config.choiceHoldDuration || 1.08;",
  );
  script = replaceRequired(
    script,
    `          scrub: 0.72,
          animateDevice: false,`,
    `          scrub: 0.48,
          choiceStart: 2.42,
          choiceHoldDuration: 1.36,
          animateDevice: false,`,
  );
  script = replaceRequired(
    script,
    `      window.requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    }`,
    `      refreshFrame = window.requestAnimationFrame(function () {
        ScrollTrigger.refresh(true);
      });

      return function cleanupLinkaHero() {
        isDisposed = true;
        cleanupController.abort();
        if (heroObserver) heroObserver.disconnect();
        if (orientationRefreshTimer) window.clearTimeout(orientationRefreshTimer);
        interactionTimers.forEach(function (timer) { window.clearTimeout(timer); });
        if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
        if (introTween) introTween.kill();
        if (choiceIntroTimeline) choiceIntroTimeline.kill();
        media.revert();
        activeMainVideos.forEach(function (video) { pauseVideo(video); });
        activeCardVideos.forEach(function (video) { pauseVideo(video); });
        delete hero.dataset.ready;
      };
    }`,
  );
  script = replaceRequired(
    script,
    `    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initLinkaHero, { once: true });
    } else {
      initLinkaHero();
    }`,
    `    if (document.readyState === "loading") {
      var cleanup = null;
      var start = function () { cleanup = initLinkaHero(); };
      document.addEventListener("DOMContentLoaded", start, { once: true });
      return function () {
        document.removeEventListener("DOMContentLoaded", start);
        if (cleanup) cleanup();
      };
    }

    return initLinkaHero();`,
  );

  return script;
}

function deferMainVideoSources(markup: string) {
  return markup.replace(
    /<video\b(?=[^>]*\bclass="[^"]*\blinka-main-video\b)[^>]*>/gi,
    (videoTag) => videoTag.replace(/\ssrc="[^"]*"/i, ""),
  );
}

function extractReference(source: string) {
  const normalizedSource = source.replace(/\r\n/g, "\n");
  const styles = Array.from(
    normalizedSource.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi),
    (match) => match[1],
  ).join("\n");
  const scripts = Array.from(
    normalizedSource.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi),
    (match) => match[1],
  )
    .filter((script) => !script.includes("revealQuatorzeVideo"))
    .map(adaptPortfolioBehavior);
  const markup = deferMainVideoSources(
    normalizedSource
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ""),
  );

  return { markup, scripts, styles };
}

export default async function Home() {
  const referencePath = path.join(process.cwd(), "referenciafuncional.html");
  const source = await readFile(referencePath, "utf8");
  const reference = extractReference(source);

  return <FunctionalReference {...reference} />;
}
