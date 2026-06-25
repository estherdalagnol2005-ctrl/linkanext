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

type LeadFormLanguage = "pt" | "en";

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
    button: string;
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
    closeLabel: "Fechar formulario",
    progressAria: (step, total) => `Etapa ${step} de ${total}`,
    progressLabel: "Etapa",
    stepLabel: (step) => `Etapa ${step}`,
    intro: {
      kicker: "Qualificacao Linka",
      title: "Vamos criar algo incrivel para o seu negocio?",
      description:
        "Responda algumas perguntas rapidas para entendermos o melhor caminho para sua presenca digital.",
      button: "Comecar",
    },
    success: {
      kicker: "Dados recebidos",
      title: "Perfeito. A proxima etapa esta quase pronta.",
      description:
        "Nesta fase, seus dados ficam apenas no navegador. Em breve, este fluxo sera conectado aos horarios da Linka.",
      button: "Fechar",
    },
    fields: {
      nameTitle: "Como devemos chamar voce?",
      nameLabel: "Nome",
      namePlaceholder: "Seu nome",
      contactTitle: "Qual e o melhor contato?",
      emailLabel: "E-mail",
      emailPlaceholder: "voce@empresa.com",
      countryLabel: "Pais",
      countryPlaceholder: "Selecione o pais",
      countrySearchLabel: "Pesquisar pais",
      countrySearchPlaceholder: "Digite o pais ou codigo",
      countryNoResults: "Nenhum pais encontrado.",
      selectedCountryAria: (name, code) => `${name}, codigo ${code}. Alterar pais.`,
      phoneLabel: "Telefone",
      phonePlaceholder: "Numero com DDD ou area",
      phoneHint: "Escolha o pais e complete o numero. O envio sera salvo em formato internacional.",
      businessTitle: "Sobre o negocio",
      businessLabel: "Negocio ou area de atuacao",
      businessPlaceholder: "Ex.: clinica, loja, profissional liberal",
      serviceLegend: "Servico que voce procura",
      investmentTitle: "Faixa de investimento",
      investmentLegend: "Escolha uma referencia inicial",
    },
    buttons: {
      back: "Voltar",
      continue: "Continuar",
      submit: "Ver horarios disponiveis",
    },
    services: [
      { label: "Criacao de site", value: "site" },
      { label: "Landing page", value: "landing-page" },
      { label: "Trafego pago", value: "trafego-pago" },
      { label: "Site + trafego", value: "site-trafego" },
      { label: "Posicionamento digital", value: "posicionamento-digital" },
      { label: "Ainda nao sei", value: "nao-sei" },
    ],
    investments: [
      { label: "Faixa inicial", value: "inicial", helper: "Projeto enxuto para comecar com clareza." },
      { label: "Faixa intermediaria", value: "intermediaria", helper: "Mais estrategia e acabamento visual." },
      { label: "Faixa avancada", value: "avancada", helper: "Experiencia mais completa e personalizada." },
      { label: "Investimento maior", value: "maior", helper: "Projeto robusto, com mais profundidade." },
      { label: "Ainda nao defini", value: "nao-defini", helper: "Podemos orientar a melhor faixa depois." },
    ],
    errors: {
      nameRequired: "Informe seu nome.",
      emailRequired: "Informe seu e-mail.",
      emailInvalid: "Use um e-mail valido.",
      countryRequired: "Selecione o pais do telefone.",
      phoneRequired: "Informe seu telefone.",
      phoneInvalid: "Use um telefone valido para o pais selecionado.",
      businessRequired: "Informe seu negocio ou area.",
      serviceRequired: "Escolha um servico.",
      investmentRequired: "Escolha uma faixa de investimento.",
    },
  },
  en: {
    closeLabel: "Close form",
    progressAria: (step, total) => `Step ${step} of ${total}`,
    progressLabel: "Step",
    stepLabel: (step) => `Step ${step}`,
    intro: {
      kicker: "Linka qualification",
      title: "Shall we create something amazing for your business?",
      description:
        "Answer a few quick questions so we can understand the best path for your digital presence.",
      button: "Start",
    },
    success: {
      kicker: "Details received",
      title: "Perfect. The next step is almost ready.",
      description:
        "For now, your details stay only in the browser. Soon, this flow will connect to Linka scheduling.",
      button: "Close",
    },
    fields: {
      nameTitle: "What should we call you?",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      contactTitle: "What is the best contact?",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      countryLabel: "Country",
      countryPlaceholder: "Select country",
      countrySearchLabel: "Search country",
      countrySearchPlaceholder: "Type country or code",
      countryNoResults: "No countries found.",
      selectedCountryAria: (name, code) => `${name}, code ${code}. Change country.`,
      phoneLabel: "Phone",
      phonePlaceholder: "Number with area code",
      phoneHint: "Choose the country and complete the number. It will be saved in international format.",
      businessTitle: "About the business",
      businessLabel: "Business or field",
      businessPlaceholder: "Ex.: clinic, store, independent professional",
      serviceLegend: "Service you are looking for",
      investmentTitle: "Investment range",
      investmentLegend: "Choose an initial reference",
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
      { label: "I am not sure yet", value: "nao-sei" },
    ],
    investments: [
      { label: "Starter range", value: "inicial", helper: "A focused project to begin with clarity." },
      { label: "Intermediate range", value: "intermediaria", helper: "More strategy and visual finish." },
      { label: "Advanced range", value: "avancada", helper: "A more complete and personalized experience." },
      { label: "Larger investment", value: "maior", helper: "A robust project with more depth." },
      { label: "Not defined yet", value: "nao-defini", helper: "We can guide the best range later." },
    ],
    errors: {
      nameRequired: "Enter your name.",
      emailRequired: "Enter your email.",
      emailInvalid: "Use a valid email.",
      countryRequired: "Select the phone country.",
      phoneRequired: "Enter your phone number.",
      phoneInvalid: "Use a valid phone number for the selected country.",
      businessRequired: "Enter your business or field.",
      serviceRequired: "Choose a service.",
      investmentRequired: "Choose an investment range.",
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

function handleLeadComplete(data: LeadFormData) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[Linka lead form]", data);
  }
}

function getFirstError(errors: LeadFormErrors) {
  return Object.keys(errors)[0] as keyof LeadFormData | undefined;
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
    return new Intl.DisplayNames([language === "pt" ? "pt-BR" : "en"], { type: "region" });
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

  return parsePhoneNumber(candidate, country)?.number ?? "";
}

export default function LeadFormModal({ isOpen, language, onClose }: LeadFormModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<LeadFormErrors>({});
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
      .sort((a, b) => a.name.localeCompare(b.name, language === "pt" ? "pt-BR" : "en"));
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
  }, []);

  useEffect(() => {
    countryListOpenRef.current = isCountryListOpen;
  }, [isCountryListOpen]);

  useEffect(() => {
    if (isOpen || !isComplete) return;

    setStep(1);
    setErrors({});
    setFormData(INITIAL_DATA);
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
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updatePhone = (value: string) => {
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
    const codigoPais = `+${getCountryCallingCode(country)}`;
    setFormData((current) => ({
      ...current,
      pais: country,
      codigoPais,
      telefoneE164: getNormalizedPhone(country, current.telefone),
    }));
    setErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors.pais;
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

  const goNext = () => {
    if (actionLockedRef.current) return;
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
    handleLeadComplete(completedData);
    setIsComplete(true);
  };

  const goBack = () => {
    if (actionLockedRef.current || step <= 1) return;
    actionLockedRef.current = true;
    window.setTimeout(() => {
      actionLockedRef.current = false;
    }, 220);
    setErrors({});
    setStep((current) => current - 1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goNext();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goNext();
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
          <p>{copy.success.description}</p>
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
          <button className="linka-lead-primary" data-lead-autofocus onClick={goNext} type="button">
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

        <div className="linka-lead-actions">
          <button className="linka-lead-secondary" disabled={step <= 1} onClick={goBack} type="button">
            {copy.buttons.back}
          </button>
          <button className="linka-lead-primary" type="submit">
            {step === TOTAL_STEPS ? copy.buttons.submit : copy.buttons.continue}
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
