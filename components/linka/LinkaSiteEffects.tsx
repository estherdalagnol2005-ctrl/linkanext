"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { WHATSAPP_ICON_URL } from "./constants";

const COPY = {
  pt: {
    title: "Linka Studio | Experiências Digitais",
    description: "A Linka cria sites, landing pages e experiências digitais com presença, clareza e valor.",
    heroKicker: "<span></span> QUEM LINKA HOJE, CONECTA AMANHÃ",
    heroTitle: "Transformamos sua marca em uma <strong>experiência digital para o cliente.</strong>",
    heroBody:
      "A Linka cria sites, landing pages e experiências online para sua marca aparecer com estilo, conectar com mais clareza e transformar visitantes em clientes.",
    heroCta: "Quero minha Linka",
    heroMagic: "Toque de mágica",
    expKicker: "<span></span> LINKA EXPERIENCE",
    expTitle: "<span>O toque de mágica</span><strong>que sua empresa merece.</strong>",
    expLead:
      "A Linka cria sites e experiências digitais com mais presença, mais clareza e mais valor percebido para a sua marca.",
    card1b: "CRIE VALOR DIGITAL",
    card1h: "Identidade Digital com Autoridade.",
    card1p:
      "A Linka cria sites e experiências digitais que fazem sua empresa ser vista com mais autoridade, mais confiança e mais valor pelos clientes certos.",
    card1s: "Autoridade digital",
    card2b: "TOQUE DE MÁGICA",
    card2h: "Sua marca será lembrada.",
    card2p:
      "Com a Linka, seu site se torna mais do que um site. Ele vira uma experiência online para encantar seu cliente e fortalecer sua marca.",
    card2s: "Experiência premium",
    card3b: "PRESENÇA QUE CONECTA",
    card3h: "Mais presença. Mais percepção.",
    card3p:
      "Uma presença digital bem construída transmite valor instantâneo, melhora sua imagem e aproxima sua empresa de clientes mais preparados para comprar.",
    card3s: "Percepção de valor",
    stack: "STACK PREMIUM",
    promoOff: "OFF liberado",
    promoHint: "Clique no <b>núcleo Linka</b><br>e desbloqueie sua condição especial",
    promoProgress: "Ativando presença digital...",
    promoBadge: "Benefício exclusivo desbloqueado",
    promoWon: "Você liberou <strong>25% OFF</strong>",
    promoRewardBody: "Para criar seu Site ou Landing Page com a Linka.",
    promoClaim: "Resgatar meu 25% OFF",
    promoKicker: "<span></span> Promoção de lançamento",
    promoTitle:
      "Aproveite nossa promoção especial.<strong>E gere alto valor para sua empresa.</strong>",
    promoBody:
      "Entre em contato agora com nosso suporte e tenha uma condição especial para iniciar seu projeto do jeito certo.",
    promoCta: "Quero minha Linka",
    transition:
      "Ser igual aos outros não é nossa ideologia. Faça sua marca ser lembrada com as criações da Linka.",
    transitionCta: "WhatsApp da Linka",
    footerBody:
      "Quebre o padrão. Construa uma presença digital com sofisticação e estilo junto com a Linka.",
    footerContact: "Contato",
    footerRights: "© 2026 Linka Studio. Todos os direitos reservados.",
    footerTagline: "Conexões digitais com mais clareza, valor e presença.",
    switchAria: "Trocar idioma para inglês",
    headerStartAria: "Voltar para o início",
    coreAria: "Ativar núcleo Linka",
    closeAria: "Fechar desconto",
    techAria: "Tecnologias utilizadas pela Linka",
    platformsAria: "Plataformas de inteligência artificial, tráfego e comunicação",
    portfolioIntroKicker: "PORTF\u00d3LIO SELECIONADO",
    portfolioIntroTitle: "Projetos que <em>ganham vida.</em>",
    portfolioIntroBody: "Sites pensados para transformar marcas em experi\u00eancias digitais memor\u00e1veis.",
    portfolioChoiceKicker: "ESCOLHA O PROJETO",
    portfolioChoiceTitleStart: "que voc\u00ea",
    portfolioChoiceTitleEm: "quer ver",
    portfolioViewProject: "Ver projeto",
    portfolioBackProjects: "Voltar aos projetos",
    portfolioExperience: "EXPERI\u00caNCIA DIGITAL",
    portfolioBeauty: "Beleza, cuidado e bem-estar",
    portfolioProperties: "Im\u00f3veis de alto padr\u00e3o",
    portfolioLeads: "Capta\u00e7\u00e3o de leads e posicionamento",
    portfolioLocalPresence: "Presen\u00e7a local e autoridade",
    portfolioBrand: "Marca, clareza e convers\u00e3o",
    portfolioCommunication: "Comunica\u00e7\u00e3o que converte",
  },
  en: {
    title: "Linka Studio | Digital Experiences",
    description:
      "Linka creates websites, landing pages and digital experiences with presence, clarity and value.",
    heroKicker: "<span></span> LINK TODAY. CONNECT TOMORROW.",
    heroTitle: "We transform your brand into a <strong>digital experience for your customers.</strong>",
    heroBody:
      "Linka creates websites, landing pages and online experiences that help your brand stand out with style, communicate clearly and turn visitors into customers.",
    heroCta: "Build my Linka",
    heroMagic: "Magic touch",
    expKicker: "<span></span> LINKA EXPERIENCE",
    expTitle: "<span>The magic touch</span><strong>your company deserves.</strong>",
    expLead:
      "Linka creates websites and digital experiences with stronger presence, greater clarity and higher perceived value for your brand.",
    card1b: "CREATE DIGITAL VALUE",
    card1h: "A Digital Identity with Authority.",
    card1p:
      "Linka creates websites and digital experiences that position your company with greater authority, stronger trust and more value for the right customers.",
    card1s: "Digital authority",
    card2b: "MAGIC TOUCH",
    card2h: "Your brand will be remembered.",
    card2p:
      "With Linka, your website becomes more than a website. It becomes an online experience designed to delight customers and strengthen your brand.",
    card2s: "Premium experience",
    card3b: "PRESENCE THAT CONNECTS",
    card3h: "More presence. More perception.",
    card3p:
      "A well-built digital presence communicates value instantly, elevates your image and connects your company with customers who are more ready to buy.",
    card3s: "Perceived value",
    stack: "PREMIUM STACK",
    promoOff: "OFF unlocked",
    promoHint: "Click the <b>Linka core</b><br>and unlock your special offer",
    promoProgress: "Activating your digital presence...",
    promoBadge: "Exclusive benefit unlocked",
    promoWon: "You unlocked <strong>25% OFF</strong>",
    promoRewardBody: "For your Linka Website or Landing Page.",
    promoClaim: "Claim my 25% OFF",
    promoKicker: "<span></span> Launch offer",
    promoTitle: "Enjoy our special launch offer.<strong>And create greater value for your company.</strong>",
    promoBody:
      "Contact our team now and receive a special condition to start your project the right way.",
    promoCta: "Build my Linka",
    transition: "Being like everyone else is not our philosophy. Make your brand memorable with Linka creations.",
    transitionCta: "Chat with Linka",
    footerBody: "Break the pattern. Build a sophisticated and stylish digital presence with Linka.",
    footerContact: "Contact",
    footerRights: "© 2026 Linka Studio. All rights reserved.",
    footerTagline: "Digital connections with greater clarity, value and presence.",
    switchAria: "Switch language to Portuguese",
    headerStartAria: "Back to the top",
    coreAria: "Activate the Linka core",
    closeAria: "Close discount",
    techAria: "Technologies used by Linka",
    platformsAria: "Artificial intelligence, advertising and communication platforms",
    portfolioIntroKicker: "SELECTED WORK",
    portfolioIntroTitle: "Projects brought <em>to life.</em>",
    portfolioIntroBody: "Websites designed to turn brands into memorable digital experiences.",
    portfolioChoiceKicker: "CHOOSE A PROJECT",
    portfolioChoiceTitleStart: "you want to",
    portfolioChoiceTitleEm: "explore",
    portfolioViewProject: "View project",
    portfolioBackProjects: "Back to projects",
    portfolioExperience: "DIGITAL EXPERIENCE",
    portfolioBeauty: "Beauty, care and well-being",
    portfolioProperties: "High-end properties",
    portfolioLeads: "Lead generation and positioning",
    portfolioLocalPresence: "Local presence and authority",
    portfolioBrand: "Brand, clarity and conversion",
    portfolioCommunication: "Communication that converts",
  },
} as const;

type Language = keyof typeof COPY;

declare global {
  interface Window {
    LINKA_I18N?: {
      apply: (lang: Language) => void;
      current: () => Language;
      whatsapp: (kind: WhatsAppKind, selectedLang?: Language) => string;
      t: (key: keyof typeof COPY.pt) => string;
    };
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
  }
}

type WhatsAppKind = "project" | "discount" | "identity" | "contact";

function storedLanguage(): Language {
  try {
    return window.localStorage.getItem("linka-language") === "en" ? "en" : "pt";
  } catch {
    return "pt";
  }
}

function whatsappUrl(kind: WhatsAppKind, selectedLang: Language) {
  const messages = {
    pt: {
      project: "Olá, vim pelo site da Linka e quero criar meu Site ou Landing Page.",
      discount:
        "Olá, desbloqueei o benefício de 25% OFF no site da Linka e quero criar meu Site ou Landing Page.",
      identity: "Olá, vim pelo site da Linka e quero criar minha identidade digital.",
      contact: "Olá, vim pelo site da Linka e quero saber mais.",
    },
    en: {
      project:
        "Hello, I found Linka through the website and I would like to create my Website or Landing Page.",
      discount:
        "Hello, I unlocked the 25% OFF benefit on the Linka website and I would like to create my Website or Landing Page.",
      identity: "Hello, I found Linka through the website and I would like to build my digital identity.",
      contact: "Hello, I found Linka through the website and I would like to learn more.",
    },
  };

  return `https://wa.me/5554996443484?text=${encodeURIComponent(messages[selectedLang][kind])}`;
}

function setHtml(selector: string, value: string) {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.innerHTML = value;
}

function setText(selector: string, value: string) {
  const element = document.querySelector<HTMLElement>(selector);
  if (element) element.textContent = value;
}

function setTextForAll(selector: string, value: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setAttributeForAll(selector: string, name: string, value: string) {
  document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
    element.setAttribute(name, value);
  });
}

function applyLanguage(nextLang: Language) {
  const lang: Language = nextLang === "en" ? "en" : "pt";
  const copy = COPY[lang];

  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  document.title = copy.title;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = copy.description;

  setAttributeForAll(".lh11-brand", "aria-label", copy.headerStartAria);
  setHtml(".lv10-kicker", copy.heroKicker);
  setHtml(".lv10-copy h1", copy.heroTitle);
  setText(".lv10-copy > p", copy.heroBody);
  setText(".lv10-cta-label", copy.heroCta);

  const heroCta = document.querySelector<HTMLAnchorElement>(".lv10-cta");
  if (heroCta) heroCta.href = whatsappUrl("project", lang);
  setText(".lv10-link", copy.heroMagic);

  setHtml(".lov64-kicker", copy.expKicker);
  setHtml(".lov64-shell h2", copy.expTitle);
  setText(".lov64-lead", copy.expLead);

  [1, 2, 3].forEach((index) => {
    const prefix = `card${index}` as "card1" | "card2" | "card3";
    setText(`.lov64-layer:nth-child(${index}) > b`, copy[`${prefix}b`]);
    setText(`.lov64-layer:nth-child(${index}) > h3`, copy[`${prefix}h`]);
    setText(`.lov64-layer:nth-child(${index}) > p`, copy[`${prefix}p`]);
    setText(`.lov64-layer:nth-child(${index}) > small`, copy[`${prefix}s`]);
  });

  setText(".lkss3-head > span", copy.stack);
  setAttributeForAll(".lkss3-row-a", "aria-label", copy.techAria);
  setAttributeForAll(".lkss3-row-b", "aria-label", copy.platformsAria);

  setText(".linka-portfolio-kicker", copy.portfolioIntroKicker);
  setHtml(".linka-portfolio-intro h2", copy.portfolioIntroTitle);
  setText(".linka-portfolio-intro p", copy.portfolioIntroBody);

  setText(".linka-choice-prompt .escolha-projeto", copy.portfolioChoiceKicker);
  setText(".linka-choice-prompt .titulo-principal > span", copy.portfolioChoiceTitleStart);
  setText(".linka-choice-prompt .titulo-principal > em", copy.portfolioChoiceTitleEm);
  setTextForAll(".linka-device-return", copy.portfolioBackProjects);
  setAttributeForAll(".linka-device-return", "aria-label", copy.portfolioBackProjects);
  setTextForAll(".linka-card-action", copy.portfolioViewProject);

  [
    { selector: ".linka-desktop-card-1", project: "Nutricionista", description: copy.portfolioBrand },
    { selector: ".linka-desktop-card-2", project: "Casa Sea", description: copy.portfolioProperties },
    { selector: ".linka-desktop-card-3", project: "Barbearia", description: copy.portfolioLeads },
    {
      selector: ".linka-desktop-card-4",
      project: "Quatorze",
      category: copy.portfolioExperience,
      description: copy.portfolioBeauty,
    },
    {
      selector: ".linka-mobile-card-1",
      project: "Quatorze",
      category: copy.portfolioExperience,
      description: copy.portfolioBeauty,
    },
    { selector: ".linka-mobile-card-2", project: "Casa Sea", description: copy.portfolioProperties },
    { selector: ".linka-mobile-card-3", project: "Barbearia", description: copy.portfolioLocalPresence },
    { selector: ".linka-mobile-card-4", project: "Nutricionista", description: copy.portfolioCommunication },
  ].forEach(({ selector, project, category, description }) => {
    const card = document.querySelector<HTMLElement>(selector);
    if (!card) return;

    card.dataset.projectTitle = project;
    card.setAttribute("aria-label", `${copy.portfolioViewProject} ${project}`);
    if (category) setText(`${selector} .linka-card-copy span`, category);
    setText(`${selector} .linka-card-copy small`, description);

    const video = card.querySelector<HTMLVideoElement>("video");
    if (video) video.setAttribute("aria-label", lang === "en" ? `${project} project preview` : `Projeto ${project}`);
  });

  setAttributeForAll(
    ".linka-laptop-screen .linka-main-video",
    "aria-label",
    lang === "en" ? "Marcenaria project shown on laptop" : "Projeto Marcenaria exibido em notebook",
  );
  setAttributeForAll(
    ".linka-main-video-mobile",
    "aria-label",
    lang === "en" ? "Marcenaria project shown on phone" : "Projeto Marcenaria exibido em celular",
  );

  setText(".lp8-discount small", copy.promoOff);
  setHtml(".lp8-hint", copy.promoHint);
  setText(".lp8-progress-top > span", copy.promoProgress);
  setText(".lp8-badge", copy.promoBadge);
  setHtml(".lp8-reward h3", copy.promoWon);
  setText(".lp8-reward > p", copy.promoRewardBody);
  setText(".lp8-reward-cta", copy.promoClaim);
  setHtml(".lp8-kicker", copy.promoKicker);
  setHtml(".lp8-copy h2", copy.promoTitle);
  setText(".lp8-copy > p", copy.promoBody);

  const promoSection = document.querySelector<HTMLElement>(".linka-promo-v8");
  const promoIsUnlocked = Boolean(promoSection?.classList.contains("is-unlocked"));
  setText(".lp8-main-cta > span", promoIsUnlocked ? copy.promoClaim : copy.promoCta);
  setAttributeForAll(".lp8-core-btn", "aria-label", copy.coreAria);
  setAttributeForAll(".lp8-close", "aria-label", copy.closeAria);
  setAttributeForAll(".lp8-discount", "href", whatsappUrl("discount", lang));
  setAttributeForAll(".lp8-reward-cta", "href", whatsappUrl("discount", lang));

  const mainPromo = document.querySelector<HTMLAnchorElement>(".lp8-main-cta");
  if (mainPromo) mainPromo.href = promoIsUnlocked ? whatsappUrl("discount", lang) : whatsappUrl("contact", lang);

  const transitionText =
    document.querySelector<HTMLElement>(".linka-nasa-transition-v3 p .lnt3-impact-text") ??
    document.querySelector<HTMLElement>(".linka-nasa-transition-v3 p");
  if (transitionText) transitionText.textContent = copy.transition;

  setText(".lnt3-cta > span", copy.transitionCta);
  const transitionCta = document.querySelector<HTMLAnchorElement>(".lnt3-cta");
  if (transitionCta) transitionCta.href = whatsappUrl("identity", lang);

  setText(".lf4-brand p", copy.footerBody);
  setText(".lf4-contact h3", copy.footerContact);
  setText(".lf4-bottom span:first-child", copy.footerRights);
  setText(".lf4-bottom span:last-child", copy.footerTagline);
  const footerWhatsApp = document.querySelector<HTMLAnchorElement>(".lf4-whatsapp");
  if (footerWhatsApp) footerWhatsApp.href = whatsappUrl("contact", lang);

  const switcher = document.querySelector<HTMLButtonElement>(".linka-language-switch");
  if (switcher) {
    switcher.setAttribute("aria-label", copy.switchAria);
    switcher.title = copy.switchAria;
  }

  document.querySelector(".lls-pt")?.classList.toggle("is-active", lang === "pt");
  document.querySelector(".lls-en")?.classList.toggle("is-active", lang === "en");

  try {
    window.localStorage.setItem("linka-language", lang);
  } catch {
    // localStorage may be unavailable in restricted browsing modes.
  }

  window.setTimeout(() => window.ScrollTrigger?.refresh(), 80);
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function chooseParticleSize() {
  const chance = Math.random();
  if (chance < 0.62) return randomBetween(1, 1.8);
  if (chance < 0.9) return randomBetween(1.8, 2.9);
  return randomBetween(3, 4.8);
}

function initParticles(addCleanup: (cleanup: () => void) => void) {
  const particleField = document.getElementById("lk5Particles");
  if (!particleField) return;
  const field = particleField;

  const particleAmounts = {
    desktop: 180,
    tablet: 125,
    mobile: 90,
  } as const;

  type ParticleMode = keyof typeof particleAmounts;
  let currentMode = "";
  let resizeTimer: number | undefined;

  function getScreenMode(): ParticleMode {
    if (window.innerWidth <= 480) return "mobile";
    if (window.innerWidth <= 820) return "tablet";
    return "desktop";
  }

  function createParticle(index: number) {
    const particle = document.createElement("span");
    particle.className = "lk5-particle";

    const size = chooseParticleSize();
    let opacityLow = randomBetween(0.14, 0.3);
    let opacityHigh = randomBetween(0.46, 0.9);

    if (index % 11 === 0) {
      particle.classList.add("is-bright");
      opacityLow = randomBetween(0.28, 0.42);
      opacityHigh = randomBetween(0.75, 1);
    }

    if (index % 5 === 0) particle.classList.add("is-blue");
    if (index % 19 === 0) particle.classList.add("is-ring");
    if (index % 23 === 0) particle.classList.add("is-soft");

    particle.style.setProperty("--x", `${randomBetween(0, 100)}%`);
    particle.style.setProperty("--y", `${randomBetween(0, 100)}%`);
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--move-x", `${randomBetween(-24, 24)}px`);
    particle.style.setProperty("--move-y", `${randomBetween(-34, 24)}px`);
    particle.style.setProperty("--move-x-end", `${randomBetween(-18, 18)}px`);
    particle.style.setProperty("--move-y-end", `${randomBetween(-28, 18)}px`);
    particle.style.setProperty("--duration", `${randomBetween(14, 34)}s`);
    particle.style.setProperty("--delay", `${randomBetween(-32, 0)}s`);
    particle.style.setProperty("--pulse-duration", `${randomBetween(4.5, 10)}s`);
    particle.style.setProperty("--pulse-delay", `${randomBetween(-10, 0)}s`);
    particle.style.setProperty("--opacity-low", opacityLow.toFixed(2));
    particle.style.setProperty("--opacity-high", opacityHigh.toFixed(2));

    return particle;
  }

  function renderParticles(force = false) {
    const newMode = getScreenMode();
    if (!force && newMode === currentMode) return;
    currentMode = newMode;

    const fragment = document.createDocumentFragment();
    field.innerHTML = "";

    for (let index = 0; index < particleAmounts[newMode]; index += 1) {
      fragment.appendChild(createParticle(index));
    }

    field.appendChild(fragment);
  }

  function handlePointerMove(event: MouseEvent) {
    if (window.innerWidth <= 820) return;

    const normalizedX = event.clientX / window.innerWidth - 0.5;
    const normalizedY = event.clientY / window.innerHeight - 0.5;

    field.style.setProperty("--lk5-parallax-x", `${normalizedX * 12}px`);
    field.style.setProperty("--lk5-parallax-y", `${normalizedY * 12}px`);
  }

  function handleResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => renderParticles(false), 180);
  }

  renderParticles(true);
  window.addEventListener("mousemove", handlePointerMove, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  addCleanup(() => {
    window.removeEventListener("mousemove", handlePointerMove);
    window.removeEventListener("resize", handleResize);
    if (resizeTimer) window.clearTimeout(resizeTimer);
    field.innerHTML = "";
  });
}

function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-linka-header-v11]");
  if (!header) return;
  header.classList.remove("is-scrolled");
}

function initHero(addCleanup: (cleanup: () => void) => void) {
  document.querySelectorAll<HTMLElement>("[data-linka-hero]").forEach((hero) => {
    if (hero.dataset.lv10Booted === "true") return;
    hero.dataset.lv10Booted = "true";

    const stage = hero.querySelector<HTMLElement>(".lv10-stage");
    const lines = hero.querySelector<SVGSVGElement>(".lv10-lines");
    const core = hero.querySelector<HTMLElement>(".lv10-core");
    const logo = hero.querySelector<HTMLImageElement>(".lv10-logo");
    const rings = Array.from(hero.querySelectorAll<HTMLElement>(".lv10-ring"));
    const glow = hero.querySelector<HTMLElement>(".lv10-glow");
    const stars = Array.from(hero.querySelectorAll<HTMLElement>(".lv10-launch-star"));
    const imgs = Array.from(hero.querySelectorAll<HTMLImageElement>(".lv10-img"));
    const copyItems = Array.from(
      hero.querySelectorAll<HTMLElement>(".lv10-kicker, .lv10-copy h1, .lv10-copy p, .lv10-actions"),
    );

    if (!stage || !lines || !core || !logo || !glow) return;

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let logoFloatTween: gsap.core.Tween | null = null;
    let preloaderDoneFrame: number | null = null;

    function startLogoFloat() {
      if (logoFloatTween) return;

      gsap.set(logo, { y: 0 });

      if (prefersReduced) return;

      logoFloatTween = gsap.to(logo, {
        y: isMobile ? -4 : -7,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      });
    }

    function handlePreloaderDone() {
      gsap.set(logo, { y: 0 });
      startLogoFloat();
    }

    const context = gsap.context(() => {
      gsap.set(lines, { opacity: 0 });
      gsap.set(core, { opacity: 0, scale: 0.92, xPercent: -50, yPercent: -50 });
      gsap.set(logo, {
        opacity: 0,
        y: 0,
        scale: 0.9,
      });
      gsap.set(imgs, { opacity: 0, y: 18, scale: 0.94, filter: "blur(3px)" });
      gsap.set(copyItems, { opacity: 0, y: 26, filter: "blur(4px)" });
      gsap.set(stars, { opacity: 0, xPercent: -50, yPercent: -50, scale: 0.28, rotate: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: hero,
          start: "top 82%",
          once: true,
        },
      });

      timeline
        .to(lines, { opacity: isMobile ? 0.54 : 0.82, duration: 0.9, ease: "power2.out" }, 0)
        .to(core, { opacity: 1, scale: 1, duration: 1.05, ease: "expo.out" }, 0.04)
        .to(
          logo,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            ease: "expo.out",
          },
          0.22,
        )
        .to(
          copyItems,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.95,
            stagger: 0.105,
            ease: "expo.out",
          },
          0.34,
        )
        .to(
          stars,
          {
            opacity: 1,
            scale: 1.08,
            rotate: 220,
            x: (_index, target: HTMLElement) =>
              parseFloat(getComputedStyle(target).getPropertyValue("--x")) || 0,
            y: (_index, target: HTMLElement) =>
              parseFloat(getComputedStyle(target).getPropertyValue("--y")) || 0,
            duration: 0.98,
            stagger: 0.18,
            ease: "expo.out",
          },
          0.72,
        )
        .to(
          stars,
          { opacity: 0, scale: 0.22, rotate: 340, duration: 0.42, stagger: 0.18, ease: "power2.inOut" },
          1.44,
        )
        .to(
          imgs,
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.78, stagger: 0.16, ease: "expo.out" },
          1.02,
        );

      gsap.to(imgs, {
        y: (index) => (index % 2 === 0 ? -5 : -7),
        duration: (index) => (isMobile ? 3.8 + index * 0.22 : 4.6 + index * 0.28),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.12,
        delay: 1.75,
      });

      gsap.to(glow, {
        scale: 1.075,
        opacity: 0.9,
        duration: 4.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(stage, {
        y: isMobile ? -18 : -34,
        rotate: isMobile ? 0 : -0.45,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.15,
        },
      });

      gsap.to(rings, {
        rotate: (index) => (index % 2 === 0 ? 42 : -36),
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.35,
        },
      });

      gsap.to(stars, {
        yPercent: -80,
        rotate: 520,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, hero);

    window.addEventListener("linka:preloader:done", handlePreloaderDone, {
      once: true,
    });

    if (window.__LINKA_PRELOADER_DONE__) {
      preloaderDoneFrame = window.requestAnimationFrame(handlePreloaderDone);
    }

    function handleMouseMove(event: MouseEvent) {
      if (isMobile) return;

      const rect = hero.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(stage, { x: mx * 8, y: my * 6, rotate: mx * 0.45, duration: 0.7, ease: "power3.out" });
      gsap.to(imgs, {
        x: (index) => mx * (index % 2 ? -8 : 8),
        y: (index) => my * (index < 2 ? -6 : 6),
        duration: 0.7,
        ease: "power3.out",
      });
    }

    function handleMouseLeave() {
      if (isMobile) return;

      gsap.to(stage, { x: 0, y: 0, rotate: 0, duration: 1, ease: "expo.out" });
      gsap.to(imgs, { x: 0, duration: 1, ease: "expo.out" });
    }

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    addCleanup(() => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("linka:preloader:done", handlePreloaderDone);
      if (preloaderDoneFrame !== null) window.cancelAnimationFrame(preloaderDoneFrame);
      logoFloatTween?.kill();
      logoFloatTween = null;
      context.revert();
      delete hero.dataset.lv10Booted;
    });
  });
}

function initExperience(addCleanup: (cleanup: () => void) => void, schedule: (callback: () => void, delay: number) => void) {
  document.querySelectorAll<HTMLElement>("[data-lov64]").forEach((root) => {
    if (root.dataset.lov67Booted === "true") return;
    root.dataset.lov67Booted = "true";
    root.classList.add("ready", "gsap-star-ready");

    const starStage = root.querySelector<HTMLElement>(".lov64-star-stage");
    const star = root.querySelector<HTMLElement>(".lov64-star");
    const halo = root.querySelector<HTMLElement>(".lov64-star-halo");
    const core = root.querySelector<HTMLElement>(".lov64-star-core");
    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".lov64-kicker, .lov64-shell h2 span, .lov64-shell h2 strong, .lov64-lead, .lov64-layer, .lov64-brand-carousel, .lov64-experience-box, .lov64-final-copy",
      ),
    );

    if (!starStage || !star || !halo || !core) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      root.classList.add("visible", "star-complete");
      return;
    }

    let done = false;
    const isMobile = () => window.matchMedia("(max-width:760px)").matches;
    const mob = isMobile();

    const context = gsap.context(() => {
      gsap.set(revealItems, {
        autoAlpha: 0,
        y: 30,
        scale: 0.985,
        filter: "blur(12px)",
        force3D: true,
      });

      gsap.set(starStage, { autoAlpha: 1 });
      gsap.set(star, {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        y: mob ? "-42vh" : "-44vh",
        scale: mob ? 0.46 : 0.52,
        rotation: mob ? -10 : -16,
        force3D: true,
        transformOrigin: "50% 50%",
      });
      gsap.set(halo, { autoAlpha: 0.16, scale: 0.8, force3D: true });
      gsap.set(core, { scale: 1, force3D: true });

      const revealTimeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      revealTimeline
        .to(
          revealItems,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: mob ? 0.055 : 0.075,
            clearProps: "transform,filter",
          },
          0,
        )
        .add(() => root.classList.add("visible"), 0);

      function finishStar() {
        if (done) return;
        done = true;

        root.classList.add("fireworks");
        revealTimeline.play(0);

        schedule(() => {
          gsap.to(starStage, {
            autoAlpha: 0,
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => root.classList.add("star-complete"),
          });
        }, mob ? 700 : 860);
      }

      const starTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: mob ? "top 112%" : "top 108%",
          end: mob ? "top 10%" : "top 8%",
          scrub: mob ? 1.25 : 1.15,
          invalidateOnRefresh: true,
          fastScrollEnd: false,
          onUpdate: (self) => {
            if (self.progress >= 0.985) finishStar();
          },
          onLeave: finishStar,
        },
      });

      starTimeline
        .to(star, { autoAlpha: 1, duration: 0.16 }, 0)
        .to(star, { y: mob ? "-2vh" : "-1vh", scale: mob ? 1.04 : 1.18, rotation: mob ? 10 : 14, duration: 0.82 }, 0)
        .to(halo, { autoAlpha: 0.52, scale: 1.08, duration: 0.82 }, 0)
        .to(star, { scale: mob ? 1.16 : 1.34, rotation: mob ? 18 : 24, duration: 0.18 }, 0.82)
        .to(core, { scale: mob ? 1.04 : 1.08, duration: 0.18 }, 0.82);

      gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
        .to(star, { x: "+=2", duration: 2.6 }, 0)
        .to(core, { rotation: "+=3", duration: 2.6 }, 0);

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => root.classList.remove("paused"),
        onEnterBack: () => root.classList.remove("paused"),
        onLeave: () => root.classList.add("paused"),
        onLeaveBack: () => root.classList.add("paused"),
      });
    }, root);

    function handleResize() {
      if (done) return;
      gsap.set(star, { y: isMobile() ? "-42vh" : "-44vh" });
      ScrollTrigger.refresh();
    }

    window.addEventListener("resize", handleResize, { passive: true });

    addCleanup(() => {
      window.removeEventListener("resize", handleResize);
      context.revert();
      delete root.dataset.lov67Booted;
      root.classList.remove("ready", "gsap-star-ready", "visible", "star-complete", "fireworks", "paused");
    });
  });
}

function initMarquee(addCleanup: (cleanup: () => void) => void) {
  function buildMarquee(marquee: HTMLElement) {
    const track = marquee.querySelector<HTMLElement>(".lkss3-track");
    const originalGroup = track?.querySelector<HTMLElement>(".lkss3-group");
    if (!track || !originalGroup) return;

    const template = originalGroup.cloneNode(true) as HTMLElement;
    template.removeAttribute("aria-hidden");

    track.innerHTML = "";
    const first = template.cloneNode(true) as HTMLElement;
    track.appendChild(first);

    let safety = 0;
    const targetWidth = marquee.offsetWidth * 2.6;

    while (track.scrollWidth < targetWidth && safety < 12) {
      const clone = template.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      safety += 1;
    }

    const firstWidth = Math.ceil(first.getBoundingClientRect().width);
    marquee.style.setProperty("--lkss3-loop-distance", `${firstWidth}px`);
  }

  function refreshAll() {
    document.querySelectorAll<HTMLElement>(".lkss3-marquee").forEach(buildMarquee);
  }

  let resizeTimer: number | undefined;
  function handleResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refreshAll, 120);
  }

  refreshAll();
  window.addEventListener("load", refreshAll);
  window.addEventListener("resize", handleResize);

  addCleanup(() => {
    window.removeEventListener("load", refreshAll);
    window.removeEventListener("resize", handleResize);
    if (resizeTimer) window.clearTimeout(resizeTimer);
  });
}

function initPromo(addCleanup: (cleanup: () => void) => void, schedule: (callback: () => void, delay: number) => void) {
  document.querySelectorAll<HTMLElement>("[data-linka-promo]").forEach((section) => {
    if (section.dataset.ready === "true") return;
    section.dataset.ready = "true";

    const trigger = section.querySelector<HTMLButtonElement>(".lp8-core-btn");
    const percent = section.querySelector<HTMLElement>(".lp8-percent");
    const fill = section.querySelector<HTMLElement>(".lp8-progress-fill");
    const reward = section.querySelector<HTMLElement>(".lp8-reward");
    const close = section.querySelector<HTMLButtonElement>(".lp8-close");
    const rewardCta = section.querySelector<HTMLAnchorElement>(".lp8-reward-cta");
    const discount = section.querySelector<HTMLAnchorElement>(".lp8-discount");
    const mainCta = section.querySelector<HTMLAnchorElement>(".lp8-main-cta");
    const fadeItems = [
      section.querySelector<HTMLElement>(".lp8-kicker"),
      section.querySelector<HTMLElement>(".lp8-copy h2"),
      section.querySelector<HTMLElement>(".lp8-copy p"),
      section.querySelector<HTMLElement>(".lp8-main-cta"),
      section.querySelector<HTMLElement>(".lp8-stage"),
    ].filter((item): item is HTMLElement => Boolean(item));

    fadeItems.forEach((item) => item.classList.add("lp8-fade"));
    if (rewardCta) rewardCta.href = whatsappUrl("discount", window.LINKA_I18N?.current() ?? "pt");
    if (discount) discount.href = whatsappUrl("discount", window.LINKA_I18N?.current() ?? "pt");

    let running = false;
    let unlocked = false;

    function setProgress(value: number) {
      const safe = Math.max(0, Math.min(25, value));
      if (percent) percent.textContent = `${safe}%`;
      if (fill) fill.style.width = `${(safe / 25) * 100}%`;
    }

    function unlock() {
      running = false;
      unlocked = true;

      section.classList.remove("is-activating");
      section.classList.add("is-unlocked", "is-burst");
      setProgress(25);

      if (mainCta) {
        const currentLanguage = window.LINKA_I18N?.current() ?? "pt";
        const label = currentLanguage === "en" ? "Claim my 25% OFF" : "Resgatar meu 25% OFF";
        mainCta.href = whatsappUrl("discount", currentLanguage);
        mainCta.target = "_blank";
        mainCta.innerHTML = `<span>${label}</span><i><img src="${WHATSAPP_ICON_URL}" alt=""></i>`;
      }

      schedule(() => {
        section.classList.add("is-reward-visible");
        reward?.setAttribute("aria-hidden", "false");
      }, 420);

      schedule(() => section.classList.remove("is-burst"), 1300);
    }

    function start() {
      if (running || unlocked) return;

      running = true;
      section.classList.add("is-activating");
      setProgress(0);

      const steps = [5, 10, 15, 20, 25];
      let index = 0;

      function next() {
        setProgress(steps[index]);
        index += 1;

        if (index < steps.length) schedule(next, 360);
        else schedule(unlock, 420);
      }

      schedule(next, 260);
    }

    function closeReward() {
      section.classList.remove("is-reward-visible");
      reward?.setAttribute("aria-hidden", "true");
    }

    trigger?.addEventListener("click", start);
    close?.addEventListener("click", closeReward);

    const isMobile = window.matchMedia("(max-width:520px)").matches;
    const context = gsap.context(() => {
      gsap.set(fadeItems, { opacity: 0, y: isMobile ? 22 : 34, force3D: true });
      gsap.to(fadeItems, {
        opacity: 1,
        y: 0,
        duration: isMobile ? 0.72 : 0.9,
        stagger: isMobile ? 0.08 : 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: isMobile ? "top 84%" : "top 76%",
          once: true,
        },
      });
    }, section);

    addCleanup(() => {
      trigger?.removeEventListener("click", start);
      close?.removeEventListener("click", closeReward);
      context.revert();
      delete section.dataset.ready;
    });
  });
}

function initTransition(addCleanup: (cleanup: () => void) => void, schedule: (callback: () => void, delay: number) => void) {
  document.querySelectorAll<HTMLElement>(".linka-nasa-transition-v3").forEach((block) => {
    if (block.dataset.lnt3ScrollReveal === "true") return;
    block.dataset.lnt3ScrollReveal = "true";
    block.classList.add("lnt3-scroll-ready");

    const textElement = block.querySelector<HTMLParagraphElement>("p");
    if (textElement && !textElement.querySelector(".lnt3-impact-text")) {
      const originalText = textElement.textContent?.trim() ?? "";
      textElement.innerHTML = `<span class="lnt3-impact-text">${originalText}</span>`;
    }

    let observer: IntersectionObserver | undefined;

    function reveal() {
      block.classList.add("lnt3-inview");
      schedule(() => block.classList.add("lnt3-text-show"), 430);
    }

    if (!("IntersectionObserver" in window)) {
      reveal();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              observer?.unobserve(block);
            }
          });
        },
        { root: null, threshold: 0.24, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(block);
    }

    addCleanup(() => {
      observer?.disconnect();
      delete block.dataset.lnt3ScrollReveal;
      block.classList.remove("lnt3-scroll-ready", "lnt3-inview", "lnt3-text-show");
    });
  });
}

function initLanguage(
  addCleanup: (cleanup: () => void) => void,
  schedule: (callback: () => void, delay: number) => void,
) {
  let lang = storedLanguage();

  const api = {
    apply: (nextLang: Language) => {
      lang = nextLang === "en" ? "en" : "pt";
      applyLanguage(lang);
    },
    current: () => lang,
    whatsapp: (kind: WhatsAppKind, selectedLang?: Language) => whatsappUrl(kind, selectedLang ?? lang),
    t: (key: keyof typeof COPY.pt) => COPY[lang][key],
  };

  window.LINKA_I18N = api;
  api.apply(lang);
  schedule(() => api.apply(lang), 250);
  schedule(() => api.apply(lang), 1000);

  const switcher = document.querySelector<HTMLButtonElement>(".linka-language-switch");
  const handleClick = () => api.apply(lang === "pt" ? "en" : "pt");
  switcher?.addEventListener("click", handleClick);

  addCleanup(() => {
    switcher?.removeEventListener("click", handleClick);
    delete window.LINKA_I18N;
  });
}

export default function LinkaSiteEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const cleanups: Array<() => void> = [];
    const timers: number[] = [];

    const addCleanup = (cleanup: () => void) => cleanups.push(cleanup);
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    initParticles(addCleanup);
    initHeader();
    initHero(addCleanup);
    initExperience(addCleanup, schedule);
    initMarquee(addCleanup);
    initPromo(addCleanup, schedule);
    initTransition(addCleanup, schedule);
    initLanguage(addCleanup, schedule);

    window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
