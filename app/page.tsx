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
      var cardVideoFallbackController = null;
      var cardAutoplayBlocked = false;

      function listen(target, type, handler, options) {
        var listenerOptions = typeof options === "boolean"
          ? { capture: options, signal: cleanupController.signal }
          : Object.assign({}, options || {}, { signal: cleanupController.signal });

        target.addEventListener(type, handler, listenerOptions);
      }`,
  );
  script = replaceRequired(
    script,
    /      function prepareVideo\(video\) \{[\s\S]*?\n      function setChoiceCardsInteractive/,
    `      function prepareVideo(video) {
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

        if (!video._linkaReadyBound) {
          video._linkaReadyBound = true;
          listen(video, "loadeddata", function () { setVideoReady(video); });
          listen(video, "playing", function () {
            video._linkaPlayPending = false;
            setVideoReady(video);
          });
        }

        video.autoplay = true;
        video.setAttribute("autoplay", "");
      }

      function setVideoReady(video) {
        video.classList.add("is-ready");
        if (video.parentElement) video.parentElement.classList.add("is-video-ready");
      }

      function loadVideo(video) {
        if (!video) return Promise.resolve(null);

        prepareVideo(video);

        if (video.readyState >= 2) {
          setVideoReady(video);
          return Promise.resolve(video);
        }

        if (video._linkaLoadPromise) return video._linkaLoadPromise;

        video._linkaLoadPromise = new Promise(function (resolve) {
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
            resolve(video);
          }

          function fail() {
            if (settled) return;
            settled = true;
            cleanupReadyListeners();
            video._linkaLoadPromise = null;
            resolve(null);
          }

          video.addEventListener("loadeddata", finish);
          video.addEventListener("canplay", finish);
          video.addEventListener("error", fail);

          if (!video.getAttribute("src") && source) {
            video.setAttribute("src", source);
            video.load();
          }
        });

        return video._linkaLoadPromise;
      }

      function unloadVideo(video) {
        if (!video || !video.getAttribute("src")) return;

        pauseVideo(video);
        video.removeAttribute("src");
        video.preload = "none";
        video._linkaLoadPromise = null;
        video.classList.remove("is-ready");
        if (video.parentElement) video.parentElement.classList.remove("is-video-ready");
        video.load();
      }

      function playVideo(video) {
        if (!video) return Promise.resolve(false);
        video._linkaShouldPlay = true;

        return loadVideo(video).then(function (loadedVideo) {
          if (!loadedVideo || !loadedVideo._linkaShouldPlay || document.hidden || !heroIsVisible) return false;
          if (!loadedVideo.paused) return true;
          if (loadedVideo._linkaPlayPending && loadedVideo._linkaPlayPromise) {
            return loadedVideo._linkaPlayPromise;
          }

          loadedVideo._linkaPlayPending = true;
          var promise = loadedVideo.play();
          loadedVideo._linkaPlayPromise = Promise.resolve(promise).then(function () {
            loadedVideo._linkaPlayPending = false;
            return true;
          }).catch(function () {
              loadedVideo._linkaPlayPending = false;
              return false;
          });
          return loadedVideo._linkaPlayPromise;
        });
      }

      function pauseVideo(video) {
        if (!video) return;
        video._linkaShouldPlay = false;
        video._linkaPlayPending = false;
        if (!video.paused) video.pause();
      }

      allVideos.forEach(prepareVideo);

      function isMobileVideo(video) {
        return Boolean(video.closest(".linka-phone-device, .linka-card-mobile"));
      }

      function clearCardVideoFallback() {
        if (!cardVideoFallbackController) return;
        cardVideoFallbackController.abort();
        cardVideoFallbackController = null;
      }

      function armCardVideoFallback() {
        if (cardVideoFallbackController || !activeCardVideos.length) return;

        cardVideoFallbackController = new AbortController();
        var fallbackOptions = { once: true, passive: true, signal: cardVideoFallbackController.signal };
        var retry = function () { startActiveCardVideos(true); };
        window.addEventListener("pointerdown", retry, fallbackOptions);
        window.addEventListener("touchstart", retry, fallbackOptions);
        window.addEventListener("scroll", retry, fallbackOptions);
      }

      function startActiveCardVideos(forceRetry) {
        if (!heroIsVisible || document.hidden || !activeCardVideos.length) {
          return Promise.resolve(false);
        }
        if (cardAutoplayBlocked && forceRetry !== true) {
          armCardVideoFallback();
          return Promise.resolve(false);
        }

        return Promise.all(activeCardVideos.map(function (video) {
          return playVideo(video);
        })).then(function () {
          var allPlaying = activeCardVideos.every(function (video) { return !video.paused; });
          cardAutoplayBlocked = !allPlaying;
          if (allPlaying) clearCardVideoFallback();
          else armCardVideoFallback();
          return allPlaying;
        });
      }

      function updateActiveVideos() {
        var useMobile = mobileQuery.matches;

        clearCardVideoFallback();
        cardAutoplayBlocked = false;

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

        activeCardVideos.forEach(function (video) { loadVideo(video); });
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
        if (!heroIsVisible || document.hidden) return;

        startActiveCardVideos();

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
          mainVideo._linkaLoadPromise = null;
          mainVideo.classList.remove("is-ready");
          if (mainVideo.parentElement) mainVideo.parentElement.classList.remove("is-video-ready");
          mainVideo.setAttribute("data-src", source);
          mainVideo.setAttribute("src", source);
          mainVideo.load();
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
    "        setChoiceCardsInteractive(true);\n        pauseAndResetChoiceVideos();\n        pauseAndResetActiveMainVideos();",
    "        setChoiceCardsInteractive(true);\n        playChoiceVideos();\n        pauseAndResetActiveMainVideos();",
  );
  script = replaceRequired(
    script,
    "        setChoiceCardsInteractive(true);\n        pauseAndResetChoiceVideos();\n        pauseAndResetActiveMainVideos();",
    "        setChoiceCardsInteractive(true);\n        playChoiceVideos();\n        pauseAndResetActiveMainVideos();",
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
  script = replaceRequired(script, "      window.addEventListener(\"pagehide\", pauseActiveVideos);", "      listen(window, \"pagehide\", pauseMainVideos);");
  script = script.replace(/\bpauseActiveVideos\b/g, "pauseMainVideos");
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
              if (timeline.time() >= choiceActivationTime) enterChoiceState(cards);
            },`,
  );
  script = replaceRequired(script, "                pauseVideo(video, true);", "");
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

        timeline.to(scrollCue, { autoAlpha: 0, duration: 0.9 }, choiceStart + 0.72);`,
  );
  script = replaceRequired(
    script,
    `      window.requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    }`,
    `      refreshFrame = window.requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });

      return function cleanupLinkaHero() {
        cleanupController.abort();
        clearCardVideoFallback();
        if (heroObserver) heroObserver.disconnect();
        if (orientationRefreshTimer) window.clearTimeout(orientationRefreshTimer);
        if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
        if (introTween) introTween.kill();
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
