"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { WHATSAPP_ICON_URL } from "./constants";

const COPY = {
  pt: {
    title: "Linka Studio | Experiências Digitais",
    description: "A Linka cria presença digital estratégica para marcas que querem se destacar.",
    heroKicker: "DESIGN · ESTRATÉGIA · TECNOLOGIA",
    heroTitleLine1: "Sites que se destacam.",
    heroTitleLine2: "Landing pages que convertem.",
    heroTitleLine3: "Experiências que",
    heroTitleEm: "conectam.",
    heroBody:
      "Criamos presença digital estratégica para marcas que querem se destacar.",
    heroCta: "Explorar projetos",
    heroContactCta: "Iniciar um projeto",
    heroServicesAria: "Serviços digitais da Linka",
    heroIntroTitle: "O que a Linka faz",
    heroIntroHint: "ROLE PARA DESCOBRIR",
    heroService1Title: "SITES",
    heroService2Title: "LANDING PAGES",
    heroService3Title: "EXPERIÊNCIAS DIGITAIS",
    heroService4Title: "LINK NA BIO",
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
    switchAria: "Escolher idioma",
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
      "Linka creates strategic digital presence for brands that want to stand out.",
    heroKicker: "DESIGN · STRATEGY · TECHNOLOGY",
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroTitleLine3: "Experiences that",
    heroTitleEm: "connect.",
    heroBody:
      "We create strategic digital presence for brands that want to stand out.",
    heroCta: "Explore projects",
    heroContactCta: "Start a project",
    heroServicesAria: "Linka digital services",
    heroIntroTitle: "What Linka does",
    heroIntroHint: "SCROLL TO DISCOVER",
    heroService1Title: "WEBSITES",
    heroService2Title: "LANDING PAGES",
    heroService3Title: "DIGITAL EXPERIENCES",
    heroService4Title: "LINK IN BIO",
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
    switchAria: "Choose language",
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
  es: {
    title: "Linka Studio | Experiencias Digitales",
    description: "Linka crea presencia digital estratégica para marcas que quieren destacar.",
    heroKicker: "DISEÑO · ESTRATEGIA · TECNOLOGÍA",
    heroTitleLine1: "Sitios que destacan.",
    heroTitleLine2: "Landing pages que convierten.",
    heroTitleLine3: "Experiencias que",
    heroTitleEm: "conectan.",
    heroBody:
      "Creamos presencia digital estratégica para marcas que quieren destacar.",
    heroCta: "Ver proyectos",
    heroContactCta: "Iniciar un proyecto",
    heroServicesAria: "Servicios digitales de Linka",
    heroIntroTitle: "Lo que hace Linka",
    heroIntroHint: "DESLIZA PARA DESCUBRIR",
    heroService1Title: "SITIOS",
    heroService2Title: "LANDING PAGES",
    heroService3Title: "EXPERIENCIAS DIGITALES",
    heroService4Title: "LINK EN BIO",
    expKicker: "<span></span> LINKA EXPERIENCE",
    expTitle: "<span>El toque mágico</span><strong>que tu empresa merece.</strong>",
    expLead:
      "Linka crea sitios web y experiencias digitales con más presencia, más claridad y mayor valor percibido para tu marca.",
    card1b: "CREA VALOR DIGITAL",
    card1h: "Identidad digital con autoridad.",
    card1p:
      "Linka crea sitios web y experiencias digitales que hacen que tu empresa sea vista con más autoridad, más confianza y más valor por los clientes adecuados.",
    card1s: "Autoridad digital",
    card2b: "TOQUE MÁGICO",
    card2h: "Tu marca será recordada.",
    card2p:
      "Con Linka, tu sitio se convierte en más que un sitio web. Se transforma en una experiencia online para encantar a tus clientes y fortalecer tu marca.",
    card2s: "Experiencia premium",
    card3b: "PRESENCIA QUE CONECTA",
    card3h: "Más presencia. Más percepción.",
    card3p:
      "Una presencia digital bien construida transmite valor al instante, mejora tu imagen y acerca tu empresa a clientes más preparados para comprar.",
    card3s: "Percepción de valor",
    stack: "STACK PREMIUM",
    promoOff: "OFF liberado",
    promoHint: "Haz clic en el <b>núcleo Linka</b><br>y desbloquea tu condición especial",
    promoProgress: "Activando presencia digital...",
    promoBadge: "Beneficio exclusivo desbloqueado",
    promoWon: "Liberaste <strong>25% OFF</strong>",
    promoRewardBody: "Para crear tu sitio web o landing page con Linka.",
    promoClaim: "Reclamar mi 25% OFF",
    promoKicker: "<span></span> Promoción de lanzamiento",
    promoTitle: "Aprovecha nuestra promoción especial.<strong>Y genera alto valor para tu empresa.</strong>",
    promoBody:
      "Contacta ahora a nuestro equipo y recibe una condición especial para iniciar tu proyecto de la forma correcta.",
    promoCta: "Quiero mi Linka",
    transition: "Ser igual a los demás no es nuestra filosofía. Haz que tu marca sea recordada con las creaciones de Linka.",
    transitionCta: "WhatsApp de Linka",
    footerBody: "Rompe el patrón. Construye una presencia digital sofisticada y con estilo junto a Linka.",
    footerContact: "Contacto",
    footerRights: "© 2026 Linka Studio. Todos los derechos reservados.",
    footerTagline: "Conexiones digitales con más claridad, valor y presencia.",
    switchAria: "Elegir idioma",
    headerStartAria: "Volver al inicio",
    coreAria: "Activar núcleo Linka",
    closeAria: "Cerrar descuento",
    techAria: "Tecnologías utilizadas por Linka",
    platformsAria: "Plataformas de inteligencia artificial, publicidad y comunicación",
    portfolioIntroKicker: "PORTAFOLIO SELECCIONADO",
    portfolioIntroTitle: "Proyectos que <em>cobran vida.</em>",
    portfolioIntroBody: "Sitios web diseñados para transformar marcas en experiencias digitales memorables.",
    portfolioChoiceKicker: "ELIGE EL PROYECTO",
    portfolioChoiceTitleStart: "que quieres",
    portfolioChoiceTitleEm: "explorar",
    portfolioViewProject: "Ver proyecto",
    portfolioBackProjects: "Volver a proyectos",
    portfolioExperience: "EXPERIENCIA DIGITAL",
    portfolioBeauty: "Belleza, cuidado y bienestar",
    portfolioProperties: "Propiedades de alto nivel",
    portfolioLeads: "Captación de leads y posicionamiento",
    portfolioLocalPresence: "Presencia local y autoridad",
    portfolioBrand: "Marca, claridad y conversión",
    portfolioCommunication: "Comunicación que convierte",
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
const LANGUAGE_STORAGE_KEY = "linka-language-v2";
const LANGUAGE_DEFAULT_EN_KEY = "linka-language-v2-default-en";

let scrollRefreshTimer: number | undefined;

function requestScrollRefresh(delay = 120, force = false) {
  if (typeof window === "undefined") return;
  if (scrollRefreshTimer) window.clearTimeout(scrollRefreshTimer);

  scrollRefreshTimer = window.setTimeout(() => {
    scrollRefreshTimer = undefined;
    window.ScrollTrigger?.refresh(force);
  }, delay);
}

function cancelScrollRefresh() {
  if (!scrollRefreshTimer || typeof window === "undefined") return;
  window.clearTimeout(scrollRefreshTimer);
  scrollRefreshTimer = undefined;
}

function normalizeLanguage(value: string | null | undefined): Language {
  if (value === "pt" || value === "es" || value === "en") return value;
  return "en";
}

function storedLanguage(): Language {
  try {
    if (window.localStorage.getItem(LANGUAGE_DEFAULT_EN_KEY) !== "true") {
      window.localStorage.setItem(LANGUAGE_DEFAULT_EN_KEY, "true");
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
      return "en";
    }

    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return "en";
  }
}

function whatsappUrl(kind: WhatsAppKind, selectedLang: Language) {
  const messages = {
    pt: {
      project:
        "Ol\u00e1, vim pelo site da Linka e quero agendar uma reuni\u00e3o para conversar sobre meu projeto.",
      discount:
        "Olá, desbloqueei o benefício de 25% OFF no site da Linka e quero criar meu Site ou Landing Page.",
      identity: "Olá, vim pelo site da Linka e quero criar minha identidade digital.",
      contact: "Olá, vim pelo site da Linka e quero saber mais.",
    },
    en: {
      project:
        "Hello, I found Linka through the website and I would like to schedule a meeting to discuss my project.",
      discount:
        "Hello, I unlocked the 25% OFF benefit on the Linka website and I would like to create my Website or Landing Page.",
      identity: "Hello, I found Linka through the website and I would like to build my digital identity.",
      contact: "Hello, I found Linka through the website and I would like to learn more.",
    },
    es: {
      project:
        "Hola, encontré Linka a través del sitio web y me gustaría agendar una reunión para conversar sobre mi proyecto.",
      discount:
        "Hola, desbloqueé el beneficio de 25% OFF en el sitio de Linka y quiero crear mi sitio web o landing page.",
      identity: "Hola, encontré Linka a través del sitio web y quiero crear mi identidad digital.",
      contact: "Hola, encontré Linka a través del sitio web y quiero saber más.",
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

function syncHeroTitleMasks() {
  document.querySelectorAll<HTMLElement>(".lhx-title-mask").forEach((mask) => {
    mask.hidden = (mask.textContent ?? "").trim().length === 0;
  });
}

function projectPreviewAria(project: string, lang: Language) {
  if (lang === "pt") return `Projeto ${project}`;
  if (lang === "es") return `Vista previa del proyecto ${project}`;
  return `${project} project preview`;
}

function mainVideoAria(device: "laptop" | "phone", lang: Language) {
  if (lang === "pt") {
    return device === "laptop" ? "Projeto Marcenaria exibido em notebook" : "Projeto Marcenaria exibido em celular";
  }

  if (lang === "es") {
    return device === "laptop"
      ? "Proyecto Marcenaria mostrado en notebook"
      : "Proyecto Marcenaria mostrado en celular";
  }

  return device === "laptop" ? "Marcenaria project shown on laptop" : "Marcenaria project shown on phone";
}

function applyLanguage(nextLang: Language) {
  const lang = normalizeLanguage(nextLang);
  const copy = COPY[lang];

  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  document.title = copy.title;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = copy.description;

  setAttributeForAll(".lh11-brand", "aria-label", copy.headerStartAria);
  setText(".lhx-kicker", copy.heroKicker);
  setText(".lhx-title-line-a", copy.heroTitleLine1);
  setText(".lhx-title-line-b", copy.heroTitleLine2);
  setText(".lhx-title-line-c-copy", copy.heroTitleLine3);
  setText(".lhx-title-em", copy.heroTitleEm);
  syncHeroTitleMasks();
  setText(".lhx-body", copy.heroBody);
  setText(".lhx-cta-label", copy.heroCta);
  setText(".lhx-link-label", copy.heroContactCta);
  setText(".lhx-card-title-text", copy.heroIntroTitle);
  setText(".lhx-card-hint", copy.heroIntroHint);
  setText(".lhx-service-title-sites", copy.heroService1Title);
  setText(".lhx-service-title-landings", copy.heroService2Title);
  setText(".lhx-service-title-experiences", copy.heroService3Title);
  setText(".lhx-service-title-bio", copy.heroService4Title);
  setAttributeForAll(".lhx-showcase", "aria-label", copy.heroServicesAria);

  const heroContact = document.querySelector<HTMLAnchorElement>(".lhx-link");
  if (heroContact) heroContact.href = whatsappUrl("project", lang);

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
    if (video) video.setAttribute("aria-label", projectPreviewAria(project, lang));
  });

  setAttributeForAll(
    ".linka-laptop-screen .linka-main-video",
    "aria-label",
    mainVideoAria("laptop", lang),
  );
  setAttributeForAll(
    ".linka-main-video-mobile",
    "aria-label",
    mainVideoAria("phone", lang),
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

  const switcher = document.querySelector<HTMLElement>(".linka-language-switch");
  if (switcher) {
    switcher.setAttribute("aria-label", copy.switchAria);
    switcher.title = copy.switchAria;
  }

  const switchTrigger = document.querySelector<HTMLButtonElement>(".lls-trigger");
  if (switchTrigger) switchTrigger.setAttribute("aria-label", copy.switchAria);

  const switchMenu = document.querySelector<HTMLElement>(".lls-menu");
  if (switchMenu) switchMenu.setAttribute("aria-label", copy.switchAria);

  const currentLanguageLabel = document.querySelector<HTMLElement>(".lls-current");
  if (currentLanguageLabel) currentLanguageLabel.textContent = lang.toUpperCase();

  document.querySelectorAll<HTMLElement>(".lls-lang[data-language]").forEach((option) => {
    const optionLanguage = normalizeLanguage(option.dataset.language);
    const isActive = optionLanguage === lang;
    option.classList.toggle("is-active", isActive);
    option.setAttribute("aria-checked", String(isActive));
  });

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // localStorage may be unavailable in restricted browsing modes.
  }

  requestScrollRefresh(90);
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
    desktop: 110,
    tablet: 60,
    mobile: 36,
  } as const;

  type ParticleMode = keyof typeof particleAmounts;
  let currentMode = "";
  let resizeTimer: number | undefined;
  let pointerFrame: number | undefined;
  let pointerX = 0;
  let pointerY = 0;

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

    pointerX = event.clientX;
    pointerY = event.clientY;

    if (pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = undefined;
      const normalizedX = pointerX / window.innerWidth - 0.5;
      const normalizedY = pointerY / window.innerHeight - 0.5;

      field.style.setProperty("--lk5-parallax-x", `${normalizedX * 12}px`);
      field.style.setProperty("--lk5-parallax-y", `${normalizedY * 12}px`);
    });
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
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    if (resizeTimer) window.clearTimeout(resizeTimer);
    field.innerHTML = "";
  });
}

function initHeader(addCleanup: (cleanup: () => void) => void) {
  const header = document.querySelector<HTMLElement>("[data-linka-header-v11]");
  if (!header) return;

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  addCleanup(() => {
    window.removeEventListener("scroll", updateHeaderState);
    header.classList.remove("is-scrolled");
  });
}

function initHero(addCleanup: (cleanup: () => void) => void) {
  document.querySelectorAll<HTMLElement>("[data-linka-hero]").forEach((hero) => {
    if (hero.dataset.lhxBooted === "true") return;

    const scene = hero.querySelector<HTMLElement>(".lhx-scene");
    const copy = hero.querySelector<HTMLElement>(".lhx-copy");
    const kicker = hero.querySelector<HTMLElement>(".lhx-kicker");
    const title = hero.querySelector<HTMLElement>(".lhx-title");
    const titleLines = Array.from(hero.querySelectorAll<HTMLElement>(".lhx-title-line"));
    const body = hero.querySelector<HTMLElement>(".lhx-body");
    const actions = hero.querySelector<HTMLElement>(".lhx-actions");
    const showcase = hero.querySelector<HTMLElement>(".lhx-showcase");
    const tunnel = hero.querySelector<HTMLElement>(".lhx-type-tunnel");
    const introCard = hero.querySelector<HTMLElement>(".lhx-intro-card");
    const cardTitle = hero.querySelector<HTMLElement>(".lhx-card-title");
    const cardTitleText = hero.querySelector<HTMLElement>(".lhx-card-title-text");
    const cardCursor = hero.querySelector<HTMLElement>(".lhx-card-cursor");
    const cardHint = hero.querySelector<HTMLElement>(".lhx-card-hint");
    const cardProgress = hero.querySelector<HTMLElement>(".lhx-card-progress");
    const serviceCards = Array.from(hero.querySelectorAll<HTMLElement>(".lhx-service-card"));
    const serviceTitles = serviceCards
      .map((card) => card.querySelector<HTMLElement>(".lhx-service-title"))
      .filter(Boolean) as HTMLElement[];
    const serviceSteps = serviceCards
      .map((card) => card.querySelector<HTMLElement>(".lhx-service-step"))
      .filter(Boolean) as HTMLElement[];
    const serviceProgress = hero.querySelector<HTMLElement>(".lhx-service-progress");
    const arcShape = hero.querySelector<HTMLElement>(".lhx-shape-arc");
    const ribbonShape = hero.querySelector<HTMLElement>(".lhx-shape-ribbon");
    const nodeShape = hero.querySelector<HTMLElement>(".lhx-shape-node");
    const greenShape = hero.querySelector<HTMLElement>(".lhx-shape-green");
    const shapes = [arcShape, ribbonShape, nodeShape, greenShape].filter(Boolean) as HTMLElement[];
    const arcTargets = arcShape ? [arcShape] : [];
    const ribbonTargets = ribbonShape ? [ribbonShape] : [];
    const nodeTargets = nodeShape ? [nodeShape] : [];
    const greenTargets = greenShape ? [greenShape] : [];

    if (
      !scene ||
      !copy ||
      !kicker ||
      !title ||
      !titleLines.length ||
      !body ||
      !actions ||
      !showcase ||
      !tunnel ||
      !introCard ||
      !cardTitle ||
      !cardTitleText ||
      !cardCursor ||
      !cardHint ||
      !cardProgress ||
      !serviceProgress ||
      serviceCards.length !== 4 ||
      serviceTitles.length !== 4 ||
      serviceSteps.length !== 4
    ) {
      return;
    }

    hero.dataset.lhxBooted = "true";

    const mm = gsap.matchMedia();
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = [kicker, body, actions, showcase, tunnel, introCard, cardTitle, cardTitleText, cardCursor, cardHint, cardProgress, serviceProgress, ...shapes].filter(Boolean) as HTMLElement[];

    function setServicesStart(isMobile: boolean) {
      gsap.set(tunnel, {
        transformPerspective: isMobile ? 720 : 1180,
        transformStyle: "preserve-3d",
      });

      gsap.set(serviceCards, {
        xPercent: -50,
        yPercent: -50,
        z: isMobile ? -260 : -560,
        y: isMobile ? 34 : 48,
        scale: isMobile ? 0.72 : 0.56,
        rotationX: isMobile ? 0 : 5,
        rotationY: isMobile ? 0 : -4,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      gsap.set(serviceTitles, { autoAlpha: 1, y: 0 });
      gsap.set(serviceSteps, { autoAlpha: 1, y: 0 });
      gsap.set(serviceProgress, {
        autoAlpha: 0,
        scaleX: 0,
        transformOrigin: "0% 50%",
      });
    }

    function showStatic() {
      gsap.set([scene, copy, title, ...titleLines, ...revealItems, ...serviceCards, ...serviceTitles, ...serviceSteps], {
        autoAlpha: 1,
        clearProps: "transform,opacity,visibility",
      });
      hero.style.setProperty("--lhx-active-color", "#3478FF");
      hero.style.setProperty("--lhx-active-soft", "#55C7FF");
      hero.classList.add("lhx-ready");
    }

    function addServiceSequence(timeline: gsap.core.Timeline, isMobile: boolean, offset: number) {
      const servicePalette = [
        { color: "#3478FF", soft: "#55C7FF" },
        { color: "#B7FF32", soft: "#3478FF" },
        { color: "#8458FF", soft: "#55C7FF" },
        { color: "#55C7FF", soft: "#B7FF32" },
      ];
      const segment = isMobile ? 1.04 : 1.08;
      const entryDuration = isMobile ? 0.3 : 0.32;
      const readDuration = segment * 0.35;
      const exitDuration = isMobile ? 0.26 : 0.3;
      const startZ = isMobile ? -220 : -520;
      const exitZ = isMobile ? 150 : 300;
      const startScale = isMobile ? 0.8 : 0.62;
      const exitScale = isMobile ? 1.08 : 1.1;
      const startY = isMobile ? 18 : 34;
      const exitY = isMobile ? -66 : -108;

      serviceCards.forEach((card, index) => {
        const start = offset + index * segment;
        const readStart = start + entryDuration;
        const exitStart = readStart + readDuration;
        const palette = servicePalette[index];

        timeline
          .set(hero, {
            "--lhx-active-color": palette.color,
            "--lhx-active-soft": palette.soft,
          }, start - 0.06)
          .to(serviceProgress, {
            autoAlpha: 1,
            scaleX: (index + 1) / serviceCards.length,
            duration: entryDuration + readDuration,
            ease: "power1.out",
          }, start)
          .set(card, {
            z: startZ,
            y: startY,
            scale: startScale,
            rotationX: isMobile ? 0 : 5,
            rotationY: isMobile ? 0 : index % 2 === 0 ? -4 : 4,
            autoAlpha: 0,
          }, start - 0.02)
          .to(card, {
            z: 0,
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            duration: entryDuration,
            ease: "power2.out",
          }, start)
          .to(card, {
            z: 0,
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            duration: readDuration,
            ease: "none",
          }, readStart)
          .to(card, {
            z: exitZ,
            y: exitY,
            scale: exitScale,
            rotationX: isMobile ? 0 : -2,
            rotationY: 0,
            autoAlpha: 0,
            duration: exitDuration,
            ease: "power2.in",
          }, exitStart);
      });
    }

    const context = gsap.context(() => {
      if (prefersReduced) {
        showStatic();
        return;
      }

      mm.add("(max-width: 900px)", () => {
        gsap.set(titleLines, { yPercent: 108 });
        gsap.set([kicker, body, actions], { autoAlpha: 0, y: 14 });
        gsap.set(showcase, { autoAlpha: 0, y: 28, scale: 0.98, transformOrigin: "50% 72%" });
        gsap.set(introCard, { xPercent: -50, yPercent: -50, autoAlpha: 0, y: 16, scale: 0.94, transformOrigin: "50% 50%" });
        gsap.set(cardTitleText, { autoAlpha: 0, yPercent: 108 });
        gsap.set(cardCursor, { autoAlpha: 0, scaleY: 0.35, transformOrigin: "50% 50%" });
        gsap.set(cardHint, { autoAlpha: 0, y: 8 });
        gsap.set(cardProgress, { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(shapes, { autoAlpha: 1, scale: 0.98 });
        setServicesStart(true);

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .add(() => hero.classList.add("lhx-ready"), 0)
          .to(titleLines, { yPercent: 0, duration: 0.58, stagger: 0.045, ease: "expo.out" }, 0.04)
          .to([kicker, body, actions], { autoAlpha: 1, y: 0, duration: 0.44, stagger: 0.045 }, 0.38)
          .to(showcase, { autoAlpha: 1, y: 0, scale: 1, duration: 0.58, ease: "expo.out" }, 0.52)
          .to(introCard, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46 }, 0.7)
          .to(cardTitleText, { autoAlpha: 1, yPercent: 0, duration: 0.42, ease: "expo.out" }, 0.82)
          .to(cardCursor, { autoAlpha: 1, scaleY: 1, duration: 0.24, ease: "power2.out" }, 0.92)
          .to(cardHint, { autoAlpha: 0.74, y: 0, duration: 0.32 }, 1.02)
          .to(cardProgress, { autoAlpha: 1, scaleX: 1, duration: 0.36, ease: "power2.out" }, 1.02);

        const scrollTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.62,
            invalidateOnRefresh: true,
          },
        });

        scrollTl
          .to([kicker, body, actions], { y: -26, autoAlpha: 0 }, 0)
          .to(title, { y: -42, autoAlpha: 0.16 }, 0.18)
          .to(introCard, { y: -48, scale: 0.9, autoAlpha: 0, duration: 0.34, ease: "power1.inOut" }, 0.14)
          .to(showcase, { y: -18, scale: 1.02, duration: 4.7 }, 0)
          .to(arcTargets, { scale: 1.18, x: 16, y: -16, rotation: 10, duration: 4.7 }, 0)
          .to(ribbonTargets, { scale: 1.08, x: -26, y: -20, rotation: -7, duration: 4.7 }, 0.04)
          .to(nodeTargets, { scale: 1.12, x: 36, y: 52, duration: 4.7 }, 0.12)
          .to(greenTargets, { scale: 1.22, x: 88, y: 94, duration: 4.7 }, 0.34);

        addServiceSequence(scrollTl, true, 0.68);
        scrollTl.to(showcase, { y: -58, autoAlpha: 0.88, duration: 0.28 }, 5.18);

        return () => {
          intro.kill();
          scrollTl.kill();
        };
      });

      mm.add("(min-width: 901px)", () => {
        gsap.set(titleLines, { yPercent: 112 });
        gsap.set([kicker, body, actions], { autoAlpha: 0, y: 18 });
        gsap.set(showcase, { autoAlpha: 0, y: 46, scale: 0.96, transformOrigin: "58% 58%" });
        gsap.set(introCard, { xPercent: -50, yPercent: -50, autoAlpha: 0, y: 18, scale: 0.94, transformOrigin: "50% 50%" });
        gsap.set(cardTitleText, { autoAlpha: 0, yPercent: 112 });
        gsap.set(cardCursor, { autoAlpha: 0, scaleY: 0.35, transformOrigin: "50% 50%" });
        gsap.set(cardHint, { autoAlpha: 0, y: 9 });
        gsap.set(cardProgress, { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(shapes, { autoAlpha: 1, scale: 0.96 });
        setServicesStart(false);

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .add(() => hero.classList.add("lhx-ready"), 0)
          .to(titleLines, { yPercent: 0, duration: 0.66, stagger: 0.055, ease: "expo.out" }, 0.04)
          .to([kicker, body, actions], { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.055 }, 0.38)
          .to(showcase, { autoAlpha: 1, y: 0, scale: 1, duration: 0.68, ease: "expo.out" }, 0.5)
          .to(introCard, { autoAlpha: 1, y: 0, scale: 1, duration: 0.52 }, 0.74)
          .to(cardTitleText, { autoAlpha: 1, yPercent: 0, duration: 0.46, ease: "expo.out" }, 0.88)
          .to(cardCursor, { autoAlpha: 1, scaleY: 1, duration: 0.26, ease: "power2.out" }, 1)
          .to(cardHint, { autoAlpha: 0.72, y: 0, duration: 0.34 }, 1.1)
          .to(cardProgress, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: "power2.out" }, 1.08);

        const scrollTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.72,
            invalidateOnRefresh: true,
          },
        });

        scrollTl
          .to(copy, { y: -82, autoAlpha: 0.18 }, 0.12)
          .to(introCard, { y: -74, scale: 0.9, autoAlpha: 0, duration: 0.36, ease: "power1.inOut" }, 0.16)
          .to(showcase, { y: -36, scale: 1.04, duration: 4.9 }, 0)
          .to(arcTargets, { scale: 1.22, x: 42, y: -28, rotation: 9, duration: 4.9 }, 0)
          .to(ribbonTargets, { scale: 1.12, x: -64, y: -28, rotation: -8, duration: 4.9 }, 0.04)
          .to(nodeTargets, { scale: 1.16, x: 72, y: 48, duration: 4.9 }, 0.12)
          .to(greenTargets, { scale: 1.24, x: 124, y: 72, duration: 4.9 }, 0.34);

        addServiceSequence(scrollTl, false, 0.74);
        scrollTl.to(showcase, { y: -84, autoAlpha: 0.9, duration: 0.32 }, 5.32);

        return () => {
          intro.kill();
          scrollTl.kill();
        };
      });
    }, hero);

    addCleanup(() => {
      mm.revert();
      context.revert();
      hero.classList.remove("lhx-ready");
      delete hero.dataset.lhxBooted;
    });
  });
}

function initPortfolioIntro(addCleanup: (cleanup: () => void) => void) {
  document.querySelectorAll<HTMLElement>(".linka-portfolio-intro").forEach((intro) => {
    if (intro.dataset.linkaPortfolioIntroBooted === "true") return;

    const items = [
      intro.querySelector<HTMLElement>(".linka-portfolio-kicker"),
      intro.querySelector<HTMLElement>(".linka-portfolio-intro h2"),
      intro.querySelector<HTMLElement>(".linka-portfolio-intro p"),
    ].filter(Boolean) as HTMLElement[];

    if (!items.length) return;

    intro.dataset.linkaPortfolioIntroBooted = "true";

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, {
        autoAlpha: 0,
        y: isMobile ? 18 : 26,
        force3D: true,
      });

      let introTween: gsap.core.Tween | undefined;
      let revealedImmediately = false;
      const revealImmediatelyOnFastScroll = (self: ScrollTrigger) => {
        if (!isMobile || revealedImmediately || Math.abs(self.getVelocity()) < 1600) return;
        revealedImmediately = true;
        gsap.set(items, { autoAlpha: 1, y: 0 });
        introTween?.progress(1);
      };

      introTween = gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: isMobile ? 0.32 : 0.9,
        stagger: isMobile ? 0.03 : 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: intro,
          start: isMobile ? "top 110%" : "top 84%",
          onEnter: revealImmediatelyOnFastScroll,
          onUpdate: revealImmediatelyOnFastScroll,
          once: true,
        },
      });
    }, intro);

    addCleanup(() => {
      context.revert();
      delete intro.dataset.linkaPortfolioIntroBooted;
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

    let resizeTimer: number | undefined;

    function handleResize() {
      if (done) return;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (done) return;
        gsap.set(star, { y: isMobile() ? "-42vh" : "-44vh" });
        requestScrollRefresh(120);
      }, 160);
    }

    window.addEventListener("resize", handleResize, { passive: true });

    addCleanup(() => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) window.clearTimeout(resizeTimer);
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
  window.addEventListener("resize", handleResize, { passive: true });

  addCleanup(() => {
    window.removeEventListener("load", refreshAll);
    window.removeEventListener("resize", handleResize);
    if (resizeTimer) window.clearTimeout(resizeTimer);
  });
}

function initViewportPerformance(addCleanup: (cleanup: () => void) => void) {
  const allVideos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
  const portfolioVideos = allVideos.filter((video) => video.closest(".linka-portfolio-mount"));
  const firstPortfolioVideo = portfolioVideos[0];
  const remainingPortfolioVideos = portfolioVideos.slice(1);
  const managedVideos = allVideos.filter((video) => !video.closest(".linka-portfolio-mount"));
  const portfolioMount = document.querySelector<HTMLElement>(".linka-portfolio-mount");
  const pausedVideos = new WeakSet<HTMLVideoElement>();
  let preloaderDoneFrame: number | undefined;

  function resumeVideo(video: HTMLVideoElement) {
    if (document.hidden || !pausedVideos.has(video)) return;
    pausedVideos.delete(video);
    video.play().catch(() => undefined);
  }

  function pauseVideo(video: HTMLVideoElement) {
    if (video.paused || video.ended) return;
    pausedVideos.add(video);
    video.pause();
  }

  let videoObserver: IntersectionObserver | undefined;
  if ("IntersectionObserver" in window) {
    videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.02;

          if (isVisible) resumeVideo(video);
          else pauseVideo(video);
        });
      },
      { root: null, rootMargin: "220px 0px", threshold: [0, 0.03, 0.18] },
    );

    managedVideos.forEach((video) => videoObserver?.observe(video));
  }

  let portfolioPreloadObserver: IntersectionObserver | undefined;
  function preloadPortfolioVideo(video: HTMLVideoElement | undefined) {
    if (!video) return;
    video.preload = "auto";
    video.setAttribute("preload", "auto");
    if (video.readyState === 0) video.load();
  }

  function preloadFirstPortfolioVideo() {
    preloadPortfolioVideo(firstPortfolioVideo);
  }

  function preloadRemainingPortfolioVideos() {
    remainingPortfolioVideos.forEach(preloadPortfolioVideo);
    portfolioPreloadObserver?.disconnect();
    portfolioPreloadObserver = undefined;
  }

  if (firstPortfolioVideo) {
    if (window.__LINKA_PRELOADER_DONE__) {
      preloaderDoneFrame = window.requestAnimationFrame(preloadFirstPortfolioVideo);
    } else {
      window.addEventListener("linka:preloader:done", preloadFirstPortfolioVideo, { once: true });
    }
  }

  if (portfolioMount && remainingPortfolioVideos.length) {
    if ("IntersectionObserver" in window) {
      portfolioPreloadObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) preloadRemainingPortfolioVideos();
        },
        { root: null, rootMargin: "3000px 0px", threshold: 0 },
      );
      portfolioPreloadObserver.observe(portfolioMount);
    } else {
      preloadRemainingPortfolioVideos();
    }
  }

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-linka-hero], [data-lov64], .linka-stack-strip-v3, [data-linka-promo], .linka-nasa-transition-v3",
    ),
  );

  function setDecorativePaused(root: HTMLElement, paused: boolean) {
    root.classList.toggle("linka-perf-paused", paused);

    if (root.matches("[data-linka-hero]")) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".lov64-star, .lov64-star-core",
      ),
    );

    gsap.getTweensOf(targets).forEach((tween) => {
      const tweenWithScrollTrigger = tween as gsap.core.Tween & { scrollTrigger?: ScrollTrigger };
      if (tweenWithScrollTrigger.scrollTrigger) return;
      if (paused) tween.pause();
      else tween.resume();
    });
  }

  let rootObserver: IntersectionObserver | undefined;
  if ("IntersectionObserver" in window) {
    rootObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const root = entry.target as HTMLElement;
          const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.01;
          setDecorativePaused(root, !isVisible);
        });
      },
      { root: null, rootMargin: "180px 0px", threshold: [0, 0.02] },
    );

    roots.forEach((root) => rootObserver?.observe(root));
  }

  function handleVisibilityChange() {
    const hidden = document.hidden;
    document.documentElement.classList.toggle("linka-doc-paused", hidden);

    if (hidden) {
      managedVideos.forEach(pauseVideo);
      return;
    }

    managedVideos.forEach((video) => {
      const rect = video.getBoundingClientRect();
      const isNearViewport = rect.bottom >= -220 && rect.top <= window.innerHeight + 220;
      if (isNearViewport) resumeVideo(video);
    });
  }

  document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

  addCleanup(() => {
    videoObserver?.disconnect();
    portfolioPreloadObserver?.disconnect();
    window.removeEventListener("linka:preloader:done", preloadFirstPortfolioVideo);
    if (preloaderDoneFrame) window.cancelAnimationFrame(preloaderDoneFrame);
    rootObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    document.documentElement.classList.remove("linka-doc-paused");
    roots.forEach((root) => root.classList.remove("linka-perf-paused"));
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
    if (rewardCta) rewardCta.href = whatsappUrl("discount", window.LINKA_I18N?.current() ?? "en");
    if (discount) discount.href = whatsappUrl("discount", window.LINKA_I18N?.current() ?? "en");

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
        const currentLanguage = window.LINKA_I18N?.current() ?? "en";
        const label = COPY[currentLanguage].promoClaim;
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
      lang = normalizeLanguage(nextLang);
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

  const switcher = document.querySelector<HTMLElement>(".linka-language-switch");
  const trigger = switcher?.querySelector<HTMLButtonElement>(".lls-trigger");
  const setMenuOpen = (isOpen: boolean) => {
    if (!switcher || !trigger) return;
    switcher.classList.toggle("is-open", isOpen);
    switcher.closest(".linka-header-v11")?.classList.toggle("has-language-menu-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
  };
  const closeMenu = () => setMenuOpen(false);
  const handleClick = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const triggerButton = target.closest<HTMLButtonElement>(".lls-trigger");
    if (triggerButton && switcher?.contains(triggerButton)) {
      setMenuOpen(!switcher.classList.contains("is-open"));
      return;
    }

    const option = target.closest<HTMLElement>(".lls-lang[data-language]");
    if (!option || !switcher?.contains(option)) return;
    api.apply(normalizeLanguage(option.dataset.language));
    closeMenu();
  };
  const handleDocumentClick = (event: MouseEvent) => {
    if (!switcher || switcher.contains(event.target as Node)) return;
    closeMenu();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !switcher?.classList.contains("is-open")) return;
    closeMenu();
    trigger?.focus();
  };
  switcher?.addEventListener("click", handleClick);
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleKeyDown);

  addCleanup(() => {
    closeMenu();
    switcher?.removeEventListener("click", handleClick);
    document.removeEventListener("click", handleDocumentClick);
    document.removeEventListener("keydown", handleKeyDown);
    delete window.LINKA_I18N;
  });
}

export default function LinkaSiteEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const cleanups: Array<() => void> = [];
    const timers: number[] = [];

    const addCleanup = (cleanup: () => void) => cleanups.push(cleanup);
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    initParticles(addCleanup);
    initHeader(addCleanup);
    initHero(addCleanup);
    initPortfolioIntro(addCleanup);
    initExperience(addCleanup, schedule);
    initMarquee(addCleanup);
    initViewportPerformance(addCleanup);
    initPromo(addCleanup, schedule);
    initTransition(addCleanup, schedule);
    initLanguage(addCleanup, schedule);

    requestScrollRefresh(140);

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      timers.forEach((timer) => window.clearTimeout(timer));
      cancelScrollRefresh();
    };
  }, []);

  return null;
}
