"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import type { Country } from "react-phone-number-input";

type LeadFormLanguage = "pt" | "en" | "es";

type LeadFormData = {
  nome: string;
  email: string;
  pais: string;
  codigoPais: string;
  telefone: string;
  telefoneE164: string;
  negocio: string;
  servico: string;
  investimento: string;
};

type LeadSubmissionStatus = "idle" | "submitting" | "error" | "success";

type LeadSubmissionPayload = LeadFormData & {
  idioma: LeadFormLanguage;
  origem: "site-linka";
  pageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

type LeadFormErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "countryRequired"
  | "phoneRequired"
  | "phoneInvalid"
  | "businessRequired"
  | "serviceRequired"
  | "investmentRequired";

type LeadFormErrors = Partial<Record<keyof LeadFormData, LeadFormErrorKey>>;

type LeadOption = {
  label: string;
  value: string;
  helper?: string;
};

type LeadFormModalProps = {
  isOpen: boolean;
  language: LeadFormLanguage;
  onClose: () => void;
};

type FormTranslation = {
  closeLabel: string;
  progressAria: (step: number, total: number) => string;
  progressLabel: string;
  stepLabel: (step: number) => string;
  intro: {
    kicker: string;
    title: string;
    description: string;
    button: string;
  };
  success: {
    kicker: string;
    title: string;
    description: string;
    fallbackDescription: string;
    button: string;
  };
  submission: {
    sending: string;
    error: string;
    retry: string;
    redirecting: string;
  };
  fields: {
    nameTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    contactTitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    countryLabel: string;
    countryPlaceholder: string;
    countrySearchLabel: string;
    countrySearchPlaceholder: string;
    countryNoResults: string;
    selectedCountryAria: (name: string, code: string) => string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHint: string;
    businessTitle: string;
    businessLabel: string;
    businessPlaceholder: string;
    serviceLegend: string;
    investmentTitle: string;
    investmentLegend: string;
  };
  buttons: {
    back: string;
    continue: string;
    submit: string;
  };
  services: LeadOption[];
  investments: LeadOption[];
  errors: Record<LeadFormErrorKey, string>;
};

const TOTAL_STEPS = 5;
const COUNTRY_LIST_ID = "linka-lead-country-list";
const COUNTRY_SEARCH_ID = "linka-lead-country-search";

const INITIAL_DATA: LeadFormData = {
  nome: "",
  email: "",
  pais: "",
  codigoPais: "",
  telefone: "",
  telefoneE164: "",
  negocio: "",
  servico: "",
  investimento: "",
};

const FORM_TRANSLATIONS = {
  pt: {
    closeLabel: "Fechar formulário",
    progressAria: (step, total) => `Etapa ${step} de ${total}`,
    progressLabel: "Etapa",
    stepLabel: (step) => `Etapa ${step}`,
    intro: {
      kicker: "Qualificação Linka",
      title: "Vamos criar algo incrível para o seu negócio?",
      description:
        "Responda algumas perguntas rápidas para entendermos o melhor caminho para sua presença digital.",
      button: "Começar",
    },
    success: {
      kicker: "Dados recebidos",
      title: "Tudo certo. Recebemos suas informações.",
      description:
        "Agora vamos abrir a agenda da Linka para você escolher o melhor horário para nossa conversa.",
      fallbackDescription:
        "Recebemos suas informações, mas a agenda ainda não está disponível. A Linka entrará em contato para combinar o melhor horário.",
      button: "Fechar",
    },
    submission: {
      sending: "Enviando...",
      error: "Não foi possível enviar seus dados agora. Verifique a conexão e tente novamente.",
      retry: "Tentar novamente",
      redirecting: "Tudo certo. Estamos abrindo a agenda da Linka.",
    },
    fields: {
      nameTitle: "Nome",
      nameLabel: "Nome",
      namePlaceholder: "Seu nome",
      contactTitle: "Qual é o melhor contato?",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@empresa.com",
      countryLabel: "País",
      countryPlaceholder: "Selecione o país",
      countrySearchLabel: "Pesquisar país",
      countrySearchPlaceholder: "Digite o país ou código",
      countryNoResults: "Nenhum país encontrado.",
      selectedCountryAria: (name, code) => `${name}, código ${code}. Alterar país.`,
      phoneLabel: "Telefone",
      phonePlaceholder: "Número com DDD ou área",
      phoneHint: "Escolha o país e complete o número. O envio será salvo em formato internacional.",
      businessTitle: "Sobre o negócio",
      businessLabel: "Negócio ou área de atuação",
      businessPlaceholder: "Ex.: clínica, loja, profissional liberal",
      serviceLegend: "Serviço que você procura",
      investmentTitle: "Sobre o investimento",
      investmentLegend: "Qual opção combina mais com o seu momento?",
    },
    buttons: {
      back: "Voltar",
      continue: "Continuar",
      submit: "Ver horários disponíveis",
    },
    services: [
      { label: "Criação de site", value: "site" },
      { label: "Landing page", value: "landing-page" },
      { label: "Tráfego pago", value: "trafego-pago" },
      { label: "Site + tráfego", value: "site-trafego" },
      { label: "Posicionamento digital", value: "posicionamento-digital" },
      { label: "Ainda não sei", value: "nao-sei" },
    ],
    investments: [
      { label: "Sim, posso investir agora", value: "pronto-para-investir" },
      { label: "Preciso entender melhor as possibilidades", value: "avaliando-possibilidades" },
      { label: "Ainda não sei", value: "ainda-nao-sei" },
    ],
    errors: {
      nameRequired: "Informe seu nome.",
      emailRequired: "Informe seu e-mail.",
      emailInvalid: "Use um e-mail válido.",
      countryRequired: "Selecione o país do telefone.",
      phoneRequired: "Informe seu telefone.",
      phoneInvalid: "Use um telefone válido para o país selecionado.",
      businessRequired: "Informe seu negócio ou área.",
      serviceRequired: "Escolha um serviço.",
      investmentRequired: "Escolha uma opção.",
    },
  },
  en: {
    closeLabel: "Close form",
    progressAria: (step, total) => `Step ${step} of ${total}`,
    progressLabel: "Step",
    stepLabel: (step) => `Step ${step}`,
    intro: {
      kicker: "Linka qualification",
      title: "Let’s create something amazing for your business.",
      description:
        "Answer a few quick questions so we can understand the best path for your digital presence.",
      button: "Start",
    },
    success: {
      kicker: "Details received",
      title: "All set. We received your information.",
      description:
        "We will now open Linka’s calendar so you can choose the best time for our conversation.",
      fallbackDescription:
        "We received your information, but the calendar is not available yet. Linka will contact you to choose the best time.",
      button: "Close",
    },
    submission: {
      sending: "Sending...",
      error: "We couldn’t send your details right now. Check your connection and try again.",
      retry: "Try again",
      redirecting: "All set. We’re opening Linka’s calendar.",
    },
    fields: {
      nameTitle: "Name",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      contactTitle: "What is the best way to reach you?",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      countryLabel: "Country",
      countryPlaceholder: "Select country",
      countrySearchLabel: "Search country",
      countrySearchPlaceholder: "Type a country or code",
      countryNoResults: "No countries found.",
      selectedCountryAria: (name, code) => `${name}, code ${code}. Change country.`,
      phoneLabel: "Phone",
      phonePlaceholder: "Number with area code",
      phoneHint: "Choose the country and complete the number. It will be saved in international format.",
      businessTitle: "About the business",
      businessLabel: "Business or industry",
      businessPlaceholder: "Ex.: clinic, store, independent professional",
      serviceLegend: "Service you are looking for",
      investmentTitle: "About the investment",
      investmentLegend: "Which option best matches your current situation?",
    },
    buttons: {
      back: "Back",
      continue: "Continue",
      submit: "See available times",
    },
    services: [
      { label: "Website creation", value: "site" },
      { label: "Landing page", value: "landing-page" },
      { label: "Paid traffic", value: "trafego-pago" },
      { label: "Website + traffic", value: "site-trafego" },
      { label: "Digital positioning", value: "posicionamento-digital" },
      { label: "I’m not sure yet", value: "nao-sei" },
    ],
    investments: [
      { label: "Yes, I can invest now", value: "pronto-para-investir" },
      { label: "I need to understand the options better", value: "avaliando-possibilidades" },
      { label: "I’m not sure yet", value: "ainda-nao-sei" },
    ],
    errors: {
      nameRequired: "Enter your name.",
      emailRequired: "Enter your email.",
      emailInvalid: "Use a valid email.",
      countryRequired: "Select the phone country.",
      phoneRequired: "Enter your phone number.",
      phoneInvalid: "Use a valid phone number for the selected country.",
      businessRequired: "Enter your business or industry.",
      serviceRequired: "Choose a service.",
      investmentRequired: "Choose an option.",
    },
  },
  es: {
    closeLabel: "Cerrar formulario",
    progressAria: (step, total) => `Etapa ${step} de ${total}`,
    progressLabel: "Etapa",
    stepLabel: (step) => `Etapa ${step}`,
    intro: {
      kicker: "Calificación Linka",
      title: "¿Creamos algo increíble para tu negocio?",
      description:
        "Responde algunas preguntas rápidas para entender el mejor camino para tu presencia digital.",
      button: "Comenzar",
    },
    success: {
      kicker: "Datos recibidos",
      title: "Todo listo. Recibimos tu información.",
      description:
        "Ahora abriremos la agenda de Linka para que elijas el mejor horario para nuestra conversación.",
      fallbackDescription:
        "Recibimos tu información, pero la agenda aún no está disponible. Linka se pondrá en contacto para elegir el mejor horario.",
      button: "Cerrar",
    },
    submission: {
      sending: "Enviando...",
      error: "No fue posible enviar tus datos ahora. Revisa la conexión e inténtalo nuevamente.",
      retry: "Inténtalo nuevamente",
      redirecting: "Todo listo. Estamos abriendo la agenda de Linka.",
    },
    fields: {
      nameTitle: "Nombre",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      contactTitle: "¿Cuál es el mejor contacto?",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "tu@empresa.com",
      countryLabel: "País",
      countryPlaceholder: "Selecciona el país",
      countrySearchLabel: "Buscar país",
      countrySearchPlaceholder: "Escribe el país o código",
      countryNoResults: "No se encontraron países.",
      selectedCountryAria: (name, code) => `${name}, código ${code}. Cambiar país.`,
      phoneLabel: "Teléfono",
      phonePlaceholder: "Número con código de área",
      phoneHint: "Elige el país y completa el número. Se guardará en formato internacional.",
      businessTitle: "Sobre el negocio",
      businessLabel: "Negocio o sector",
      businessPlaceholder: "Ej.: clínica, tienda, profesional independiente",
      serviceLegend: "Servicio que buscas",
      investmentTitle: "Sobre la inversión",
      investmentLegend: "¿Qué opción refleja mejor tu momento actual?",
    },
    buttons: {
      back: "Volver",
      continue: "Continuar",
      submit: "Ver horarios disponibles",
    },
    services: [
      { label: "Creación de sitio web", value: "site" },
      { label: "Landing page", value: "landing-page" },
      { label: "Tráfico pago", value: "trafego-pago" },
      { label: "Sitio web + tráfico", value: "site-trafego" },
      { label: "Posicionamiento digital", value: "posicionamento-digital" },
      { label: "Aún no lo sé", value: "nao-sei" },
    ],
    investments: [
      { label: "Sí, puedo invertir ahora", value: "pronto-para-investir" },
      { label: "Necesito entender mejor las posibilidades", value: "avaliando-possibilidades" },
      { label: "Aún no lo sé", value: "ainda-nao-sei" },
    ],
    errors: {
      nameRequired: "Ingresa tu nombre.",
      emailRequired: "Ingresa tu correo electrónico.",
      emailInvalid: "Usa un correo electrónico válido.",
      countryRequired: "Selecciona el país del teléfono.",
      phoneRequired: "Ingresa tu teléfono.",
      phoneInvalid: "Usa un teléfono válido para el país seleccionado.",
      businessRequired: "Ingresa tu negocio o sector.",
      serviceRequired: "Elige un servicio.",
      investmentRequired: "Elige una opción.",
    },
  },
} satisfies Record<LeadFormLanguage, FormTranslation>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFirstError(errors: LeadFormErrors) {
  return Object.keys(errors)[0] as keyof LeadFormData | undefined;
}

function getUrlParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim().slice(0, 180) ?? "";
}

function buildLeadPayload(data: LeadFormData, language: LeadFormLanguage): LeadSubmissionPayload {
  const currentUrl = window.location.href;
  const searchParams = new URL(currentUrl).searchParams;

  return {
    ...data,
    idioma: language,
    origem: "site-linka",
    pageUrl: currentUrl,
    utmSource: getUrlParam(searchParams, "utm_source"),
    utmMedium: getUrlParam(searchParams, "utm_medium"),
    utmCampaign: getUrlParam(searchParams, "utm_campaign"),
  };
}

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getFlagEmoji(country: Country) {
  const codePoints = country
    .toUpperCase()
    .split("")
    .map((letter) => 127397 + letter.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

function getCountryNameFormatter(language: LeadFormLanguage) {
  try {
    const locale = language === "pt" ? "pt-BR" : language;
    return new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    return null;
  }
}

function buildPhoneCandidate(country: Country, phone: string) {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) return "";

  if (trimmedPhone.startsWith("+")) {
    return trimmedPhone.replace(/[^\d+]/g, "");
  }

  const digits = trimmedPhone.replace(/\D/g, "");
  if (!digits) return "";

  return `+${getCountryCallingCode(country)}${digits}`;
}

function getNormalizedPhone(countryCode: string, phone: string) {
  if (!countryCode) return "";
  const country = countryCode as Country;
  const candidate = buildPhoneCandidate(country, phone);
  if (!candidate || !isValidPhoneNumber(candidate, country)) return "";

  const parsedPhone = parsePhoneNumber(candidate, country);
  if (parsedPhone?.country !== country) return "";

  return parsedPhone.number ?? "";
}

export default function LeadFormModal({ isOpen, language, onClose }: LeadFormModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submissionStatus, setSubmissionStatus] = useState<LeadSubmissionStatus>("idle");
  const [isCountryListOpen, setIsCountryListOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const countryButtonRef = useRef<HTMLButtonElement>(null);
  const countrySearchRef = useRef<HTMLInputElement>(null);
  const countryPickerRef = useRef<HTMLDivElement>(null);
  const countryListOpenRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const actionLockedRef = useRef(false);
  const redirectTimeoutRef = useRef<number | null>(null);
  const submissionLockedRef = useRef(false);

  const copy = FORM_TRANSLATIONS[language];
  const progressPercent = useMemo(() => `${Math.round((step / TOTAL_STEPS) * 100)}%`, [step]);
  const countryNameFormatter = useMemo(() => getCountryNameFormatter(language), [language]);
  const countryOptions = useMemo(() => {
    const countries = getCountries();

    return countries
      .map((country) => {
        const name = countryNameFormatter?.of(country) ?? country;
        const callingCode = `+${getCountryCallingCode(country)}`;
        return {
          country,
          name,
          callingCode,
          flag: getFlagEmoji(country),
          searchValue: stripDiacritics(`${name} ${country} ${callingCode}`),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, language === "pt" ? "pt-BR" : language));
  }, [countryNameFormatter, language]);

  const selectedCountry = useMemo(
    () => countryOptions.find((option) => option.country === formData.pais),
    [countryOptions, formData.pais],
  );

  const filteredCountries = useMemo(() => {
    const query = stripDiacritics(countrySearch.trim());
    if (!query) return countryOptions;

    return countryOptions.filter((option) => option.searchValue.includes(query));
  }, [countryOptions, countrySearch]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (redirectTimeoutRef.current) window.clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    countryListOpenRef.current = isCountryListOpen;
  }, [isCountryListOpen]);

  useEffect(() => {
    if (isOpen || !isComplete) return;

    setStep(1);
    setErrors({});
    setFormData(INITIAL_DATA);
    setSubmissionStatus("idle");
    setIsCountryListOpen(false);
    setCountrySearch("");
    setIsComplete(false);
  }, [isOpen, isComplete]);

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previousStyles = {
      htmlOverflow: html.style.overflow,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    scrollPositionRef.current = window.scrollY;
    html.classList.add("linka-lead-html-locked");
    html.style.overflow = "hidden";
    body.classList.add("linka-lead-page-locked");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (countryListOpenRef.current) {
          event.preventDefault();
          setIsCountryListOpen(false);
          countryButtonRef.current?.focus({ preventScroll: true });
          return;
        }

        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      ).filter((item) => item.offsetParent !== null || item === document.activeElement);

      if (!focusableItems.length) return;

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      html.classList.remove("linka-lead-html-locked");
      body.classList.remove("linka-lead-page-locked");
      html.style.overflow = previousStyles.htmlOverflow;
      body.style.overflow = previousStyles.overflow;
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.left = previousStyles.left;
      body.style.right = previousStyles.right;
      body.style.width = previousStyles.width;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      const target =
        overlayRef.current?.querySelector<HTMLElement>("[data-lead-autofocus]") ??
        closeButtonRef.current;
      target?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [isOpen, step, isComplete]);

  useEffect(() => {
    if (!isCountryListOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      countrySearchRef.current?.focus({ preventScroll: true });
    });

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || countryPickerRef.current?.contains(target)) return;
      setIsCountryListOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isCountryListOpen]);

  const updateField = (field: keyof LeadFormData, value: string) => {
    if (submissionStatus === "error") setSubmissionStatus("idle");
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updatePhone = (value: string) => {
    if (submissionStatus === "error") setSubmissionStatus("idle");
    setFormData((current) => {
      const telefoneE164 = getNormalizedPhone(current.pais, value);
      return { ...current, telefone: value, telefoneE164 };
    });
    setErrors((current) => {
      if (!current.telefone) return current;
      const nextErrors = { ...current };
      delete nextErrors.telefone;
      return nextErrors;
    });
  };

  const selectCountry = (country: Country) => {
    if (submissionStatus === "error") setSubmissionStatus("idle");
    const codigoPais = `+${getCountryCallingCode(country)}`;
    const phoneIsCompatible = !formData.telefone.trim() || Boolean(getNormalizedPhone(country, formData.telefone));

    setFormData((current) => ({
      ...current,
      pais: country,
      codigoPais,
      telefoneE164: getNormalizedPhone(country, current.telefone),
    }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors.pais;
      if (phoneIsCompatible) {
        delete nextErrors.telefone;
      } else {
        nextErrors.telefone = "phoneInvalid";
      }
      return nextErrors;
    });
    setCountrySearch("");
    setIsCountryListOpen(false);
    window.requestAnimationFrame(() => {
      countryButtonRef.current?.focus({ preventScroll: true });
    });
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: LeadFormErrors = {};

    if (currentStep === 2 && !formData.nome.trim()) {
      nextErrors.nome = "nameRequired";
    }

    if (currentStep === 3) {
      const email = formData.email.trim();
      const telefone = formData.telefone.trim();

      if (!email) {
        nextErrors.email = "emailRequired";
      } else if (!EMAIL_PATTERN.test(email)) {
        nextErrors.email = "emailInvalid";
      }

      if (!formData.pais) {
        nextErrors.pais = "countryRequired";
      }

      if (!telefone) {
        nextErrors.telefone = "phoneRequired";
      } else if (!getNormalizedPhone(formData.pais, telefone)) {
        nextErrors.telefone = "phoneInvalid";
      }
    }

    if (currentStep === 4) {
      if (!formData.negocio.trim()) nextErrors.negocio = "businessRequired";
      if (!formData.servico) nextErrors.servico = "serviceRequired";
    }

    if (currentStep === 5 && !formData.investimento) {
      nextErrors.investimento = "investmentRequired";
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const focusFirstError = (nextErrors: LeadFormErrors) => {
    const firstError = getFirstError(nextErrors);
    if (!firstError) return;

    window.requestAnimationFrame(() => {
      overlayRef.current
        ?.querySelector<HTMLElement>(`[data-lead-field="${firstError}"]`)
        ?.focus({ preventScroll: false });
    });
  };

  const submitLead = async (completedData: LeadFormData) => {
    if (submissionLockedRef.current || submissionStatus === "submitting" || submissionStatus === "success") return;

    submissionLockedRef.current = true;
    setSubmissionStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadPayload(completedData, language)),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !result?.ok) {
        throw new Error("lead_submit_failed");
      }

      setSubmissionStatus("success");
      setIsComplete(true);

      const bookingUrl = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL;
      if (bookingUrl && !redirectTimeoutRef.current) {
        redirectTimeoutRef.current = window.setTimeout(() => {
          window.location.assign(bookingUrl);
        }, 900);
      }
    } catch {
      setSubmissionStatus("error");
      window.requestAnimationFrame(() => {
        overlayRef.current?.querySelector<HTMLElement>("[data-lead-submit]")?.focus({ preventScroll: false });
      });
    } finally {
      submissionLockedRef.current = false;
    }
  };

  const goNext = async () => {
    if (actionLockedRef.current) return;
    if (submissionStatus === "submitting") return;

    actionLockedRef.current = true;
    window.setTimeout(() => {
      actionLockedRef.current = false;
    }, 260);

    if (step === 1) {
      setStep(2);
      return;
    }

    const nextErrors = validateStep(step);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return;
    }

    if (step === 3) {
      const telefoneE164 = getNormalizedPhone(formData.pais, formData.telefone);
      setFormData((current) => ({
        ...current,
        email: current.email.trim(),
        telefone: current.telefone.trim(),
        telefoneE164,
      }));
    }

    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      return;
    }

    const completedData: LeadFormData = {
      ...formData,
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      telefone: formData.telefone.trim(),
      telefoneE164: getNormalizedPhone(formData.pais, formData.telefone),
      negocio: formData.negocio.trim(),
    };

    setFormData(completedData);
    await submitLead(completedData);
  };

  const goBack = () => {
    if (actionLockedRef.current || step <= 1) return;
    actionLockedRef.current = true;
    window.setTimeout(() => {
      actionLockedRef.current = false;
    }, 220);
    setErrors({});
    if (submissionStatus === "error") setSubmissionStatus("idle");
    setStep((current) => current - 1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void goNext();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void goNext();
    }
  };

  const handleCountrySearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const firstCountry = filteredCountries[0]?.country;
      if (firstCountry) selectCountry(firstCountry);
    }
  };

  const renderFieldError = (field: keyof LeadFormData, id: string) => {
    const errorKey = errors[field];
    if (!errorKey) return null;

    return (
      <p className="linka-lead-error" id={id}>
        {copy.errors[errorKey]}
      </p>
    );
  };

  const renderRadioGroup = (
    field: "servico" | "investimento",
    legend: string,
    options: LeadOption[],
  ) => (
    <fieldset className="linka-lead-fieldset" aria-describedby={`${field}-error`}>
      <legend>{legend}</legend>
      <div className="linka-lead-option-grid">
        {options.map((option) => {
          const isSelected = formData[field] === option.value;
          return (
            <label className="linka-lead-option" data-selected={isSelected} key={option.value}>
              <input
                aria-invalid={Boolean(errors[field])}
                checked={isSelected}
                data-lead-field={field}
                name={field}
                onChange={() => updateField(field, option.value)}
                type="radio"
                value={option.value}
              />
              <span>
                <strong>{option.label}</strong>
                {option.helper ? <small>{option.helper}</small> : null}
              </span>
            </label>
          );
        })}
      </div>
      {renderFieldError(field, `${field}-error`)}
    </fieldset>
  );

  const renderCountrySelector = () => (
    <div className="linka-lead-country" ref={countryPickerRef}>
      <button
        aria-controls={COUNTRY_LIST_ID}
        aria-describedby={errors.pais ? "pais-error" : undefined}
        aria-expanded={isCountryListOpen}
        aria-haspopup="listbox"
        aria-invalid={Boolean(errors.pais)}
        aria-label={
          selectedCountry
            ? copy.fields.selectedCountryAria(selectedCountry.name, selectedCountry.callingCode)
            : copy.fields.countryPlaceholder
        }
        className="linka-lead-country-trigger"
        data-lead-autofocus
        data-lead-field="pais"
        id="linka-lead-country-trigger"
        onClick={() => setIsCountryListOpen((current) => !current)}
        ref={countryButtonRef}
        type="button"
      >
        {selectedCountry ? (
          <>
            <span aria-hidden="true" className="linka-lead-country-flag">
              {selectedCountry.flag}
            </span>
            <span className="linka-lead-country-copy">
              <strong>{selectedCountry.name}</strong>
              <small>{selectedCountry.callingCode}</small>
            </span>
          </>
        ) : (
          <span className="linka-lead-country-placeholder">{copy.fields.countryPlaceholder}</span>
        )}
        <span aria-hidden="true" className="linka-lead-country-chevron">
          v
        </span>
      </button>

      {isCountryListOpen ? (
        <div className="linka-lead-country-menu">
          <label className="linka-lead-country-search-label" htmlFor={COUNTRY_SEARCH_ID}>
            {copy.fields.countrySearchLabel}
          </label>
          <input
            autoComplete="off"
            id={COUNTRY_SEARCH_ID}
            onChange={(event) => setCountrySearch(event.target.value)}
            onKeyDown={handleCountrySearchKeyDown}
            placeholder={copy.fields.countrySearchPlaceholder}
            ref={countrySearchRef}
            type="search"
            value={countrySearch}
          />
          <div className="linka-lead-country-list" id={COUNTRY_LIST_ID} role="listbox">
            {filteredCountries.length ? (
              filteredCountries.map((option) => {
                const isSelected = option.country === formData.pais;
                return (
                  <button
                    aria-selected={isSelected}
                    className="linka-lead-country-option"
                    key={option.country}
                    onClick={() => selectCountry(option.country)}
                    role="option"
                    type="button"
                  >
                    <span aria-hidden="true" className="linka-lead-country-flag">
                      {option.flag}
                    </span>
                    <span>
                      <strong>{option.name}</strong>
                      <small>
                        {option.country} {option.callingCode}
                      </small>
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="linka-lead-country-empty">{copy.fields.countryNoResults}</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderStep = () => {
    if (isComplete) {
      return (
        <div className="linka-lead-panel linka-lead-panel-success">
          <span className="linka-lead-kicker">{copy.success.kicker}</span>
          <h2 id="linka-lead-modal-title">{copy.success.title}</h2>
          <p>
            {process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL
              ? copy.success.description
              : copy.success.fallbackDescription}
          </p>
          {submissionStatus === "success" && process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL ? (
            <p className="linka-lead-hint">{copy.submission.redirecting}</p>
          ) : null}
          <button className="linka-lead-primary" data-lead-autofocus onClick={onClose} type="button">
            {copy.success.button}
          </button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="linka-lead-panel">
          <span className="linka-lead-kicker">{copy.intro.kicker}</span>
          <h2 id="linka-lead-modal-title">{copy.intro.title}</h2>
          <p>{copy.intro.description}</p>
          <button className="linka-lead-primary" data-lead-autofocus onClick={() => void goNext()} type="button">
            {copy.intro.button}
          </button>
        </div>
      );
    }

    return (
      <form className="linka-lead-form" noValidate onSubmit={handleSubmit}>
        {step === 2 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">{copy.stepLabel(2)}</span>
            <h2 id="linka-lead-modal-title">{copy.fields.nameTitle}</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-nome">{copy.fields.nameLabel}</label>
              <input
                aria-describedby={errors.nome ? "nome-error" : undefined}
                aria-invalid={Boolean(errors.nome)}
                autoComplete="given-name"
                data-lead-autofocus
                data-lead-field="nome"
                id="linka-lead-nome"
                onChange={(event) => updateField("nome", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={copy.fields.namePlaceholder}
                type="text"
                value={formData.nome}
              />
              {renderFieldError("nome", "nome-error")}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">{copy.stepLabel(3)}</span>
            <h2 id="linka-lead-modal-title">{copy.fields.contactTitle}</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-email">{copy.fields.emailLabel}</label>
              <input
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                data-lead-field="email"
                id="linka-lead-email"
                inputMode="email"
                onChange={(event) => updateField("email", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={copy.fields.emailPlaceholder}
                type="email"
                value={formData.email}
              />
              {renderFieldError("email", "email-error")}
            </div>

            <div className="linka-lead-field">
              <label htmlFor="linka-lead-country-trigger">{copy.fields.countryLabel}</label>
              {renderCountrySelector()}
              {renderFieldError("pais", "pais-error")}
            </div>

            <div className="linka-lead-field">
              <label htmlFor="linka-lead-telefone">{copy.fields.phoneLabel}</label>
              <div className="linka-lead-phone-row">
                <span aria-hidden="true" className="linka-lead-phone-code">
                  {formData.codigoPais || "+--"}
                </span>
                <input
                  aria-describedby={errors.telefone ? "telefone-error" : "telefone-hint"}
                  aria-invalid={Boolean(errors.telefone)}
                  autoComplete="tel-national"
                  data-lead-field="telefone"
                  id="linka-lead-telefone"
                  inputMode="tel"
                  onChange={(event) => updatePhone(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={copy.fields.phonePlaceholder}
                  type="tel"
                  value={formData.telefone}
                />
              </div>
              {errors.telefone ? (
                renderFieldError("telefone", "telefone-error")
              ) : (
                <p className="linka-lead-hint" id="telefone-hint">
                  {copy.fields.phoneHint}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">{copy.stepLabel(4)}</span>
            <h2 id="linka-lead-modal-title">{copy.fields.businessTitle}</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-negocio">{copy.fields.businessLabel}</label>
              <input
                aria-describedby={errors.negocio ? "negocio-error" : undefined}
                aria-invalid={Boolean(errors.negocio)}
                autoComplete="organization"
                data-lead-autofocus
                data-lead-field="negocio"
                id="linka-lead-negocio"
                onChange={(event) => updateField("negocio", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={copy.fields.businessPlaceholder}
                type="text"
                value={formData.negocio}
              />
              {renderFieldError("negocio", "negocio-error")}
            </div>
            {renderRadioGroup("servico", copy.fields.serviceLegend, copy.services)}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">{copy.stepLabel(5)}</span>
            <h2 id="linka-lead-modal-title">{copy.fields.investmentTitle}</h2>
            {renderRadioGroup("investimento", copy.fields.investmentLegend, copy.investments)}
          </div>
        ) : null}

        {submissionStatus === "error" ? (
          <p className="linka-lead-error" id="lead-submit-error">
            {copy.submission.error}
          </p>
        ) : null}

        <div className="linka-lead-actions">
          <button
            className="linka-lead-secondary"
            disabled={step <= 1 || submissionStatus === "submitting"}
            onClick={goBack}
            type="button"
          >
            {copy.buttons.back}
          </button>
          <button
            aria-describedby={submissionStatus === "error" ? "lead-submit-error" : undefined}
            className="linka-lead-primary"
            data-lead-submit
            disabled={submissionStatus === "submitting"}
            type="submit"
          >
            {submissionStatus === "submitting"
              ? copy.submission.sending
              : submissionStatus === "error"
                ? copy.submission.retry
                : step === TOTAL_STEPS
                  ? copy.buttons.submit
                  : copy.buttons.continue}
          </button>
        </div>
      </form>
    );
  };

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      aria-labelledby="linka-lead-modal-title"
      aria-modal="true"
      className="linka-lead-overlay"
      ref={overlayRef}
      role="dialog"
    >
      <div className="linka-lead-shell" role="document">
        <button
          aria-label={copy.closeLabel}
          className="linka-lead-close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <span aria-hidden="true">x</span>
        </button>

        <div aria-hidden="true" className="linka-lead-orbit">
          <span />
          <span />
        </div>

        {!isComplete ? (
          <div className="linka-lead-progress" aria-label={copy.progressAria(step, TOTAL_STEPS)}>
            <div>
              <span>{copy.progressLabel}</span>
              <strong>
                {step}/{TOTAL_STEPS}
              </strong>
            </div>
            <i>
              <b style={{ width: progressPercent }} />
            </i>
          </div>
        ) : null}

        <div className="linka-lead-content" key={isComplete ? "complete" : step}>
          {renderStep()}
        </div>
      </div>
    </div>,
    document.body,
  );
}
