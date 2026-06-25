"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LeadFormData = {
  nome: string;
  email: string;
  telefone: string;
  negocio: string;
  servico: string;
  investimento: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormData, string>>;

type LeadOption = {
  label: string;
  value: string;
  helper?: string;
};

type LeadFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TOTAL_STEPS = 5;

const INITIAL_DATA: LeadFormData = {
  nome: "",
  email: "",
  telefone: "",
  negocio: "",
  servico: "",
  investimento: "",
};

const FORM_COPY = {
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
};

const SERVICE_OPTIONS: LeadOption[] = [
  { label: "Criacao de site", value: "site" },
  { label: "Landing page", value: "landing-page" },
  { label: "Trafego pago", value: "trafego-pago" },
  { label: "Site + trafego", value: "site-trafego" },
  { label: "Posicionamento digital", value: "posicionamento-digital" },
  { label: "Ainda nao sei", value: "nao-sei" },
];

const INVESTMENT_OPTIONS: LeadOption[] = [
  { label: "Faixa inicial", value: "inicial", helper: "Projeto enxuto para comecar com clareza." },
  { label: "Faixa intermediaria", value: "intermediaria", helper: "Mais estrategia e acabamento visual." },
  { label: "Faixa avancada", value: "avancada", helper: "Experiencia mais completa e personalizada." },
  { label: "Investimento maior", value: "maior", helper: "Projeto robusto, com mais profundidade." },
  { label: "Ainda nao defini", value: "nao-defini", helper: "Podemos orientar a melhor faixa depois." },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{6,24}$/;
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

export default function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const actionLockedRef = useRef(false);

  const progressPercent = useMemo(() => `${Math.round((step / TOTAL_STEPS) * 100)}%`, [step]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen || !isComplete) return;

    setStep(1);
    setErrors({});
    setFormData(INITIAL_DATA);
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

  const updateField = (field: keyof LeadFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validateStep = (currentStep: number) => {
    const nextErrors: LeadFormErrors = {};

    if (currentStep === 2 && !formData.nome.trim()) {
      nextErrors.nome = "Informe seu nome.";
    }

    if (currentStep === 3) {
      const email = formData.email.trim();
      const telefone = formData.telefone.trim();

      if (!email) {
        nextErrors.email = "Informe seu e-mail.";
      } else if (!EMAIL_PATTERN.test(email)) {
        nextErrors.email = "Use um e-mail valido.";
      }

      if (telefone && !PHONE_PATTERN.test(telefone)) {
        nextErrors.telefone = "Use um telefone valido com numeros, espacos, parenteses, hifens ou +.";
      }
    }

    if (currentStep === 4) {
      if (!formData.negocio.trim()) nextErrors.negocio = "Informe seu negocio ou area.";
      if (!formData.servico) nextErrors.servico = "Escolha um servico.";
    }

    if (currentStep === 5 && !formData.investimento) {
      nextErrors.investimento = "Escolha uma faixa de investimento.";
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
      setFormData((current) => ({ ...current, email: current.email.trim() }));
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
      {errors[field] ? (
        <p className="linka-lead-error" id={`${field}-error`}>
          {errors[field]}
        </p>
      ) : null}
    </fieldset>
  );

  const renderStep = () => {
    if (isComplete) {
      return (
        <div className="linka-lead-panel linka-lead-panel-success">
          <span className="linka-lead-kicker">{FORM_COPY.success.kicker}</span>
          <h2 id="linka-lead-modal-title">{FORM_COPY.success.title}</h2>
          <p>{FORM_COPY.success.description}</p>
          <button className="linka-lead-primary" data-lead-autofocus onClick={onClose} type="button">
            {FORM_COPY.success.button}
          </button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="linka-lead-panel">
          <span className="linka-lead-kicker">{FORM_COPY.intro.kicker}</span>
          <h2 id="linka-lead-modal-title">{FORM_COPY.intro.title}</h2>
          <p>{FORM_COPY.intro.description}</p>
          <button className="linka-lead-primary" data-lead-autofocus onClick={goNext} type="button">
            {FORM_COPY.intro.button}
          </button>
        </div>
      );
    }

    return (
      <form className="linka-lead-form" noValidate onSubmit={handleSubmit}>
        {step === 2 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">Etapa 2</span>
            <h2 id="linka-lead-modal-title">Como devemos chamar voce?</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-nome">Nome</label>
              <input
                aria-describedby={errors.nome ? "nome-error" : undefined}
                aria-invalid={Boolean(errors.nome)}
                autoComplete="given-name"
                data-lead-autofocus
                data-lead-field="nome"
                id="linka-lead-nome"
                onChange={(event) => updateField("nome", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Seu nome"
                type="text"
                value={formData.nome}
              />
              {errors.nome ? (
                <p className="linka-lead-error" id="nome-error">
                  {errors.nome}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">Etapa 3</span>
            <h2 id="linka-lead-modal-title">Qual e o melhor contato?</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-email">E-mail</label>
              <input
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                data-lead-autofocus
                data-lead-field="email"
                id="linka-lead-email"
                inputMode="email"
                onChange={(event) => updateField("email", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="voce@empresa.com"
                type="email"
                value={formData.email}
              />
              {errors.email ? (
                <p className="linka-lead-error" id="email-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="linka-lead-field">
              <label htmlFor="linka-lead-telefone">Telefone opcional</label>
              <input
                aria-describedby={errors.telefone ? "telefone-error" : "telefone-hint"}
                aria-invalid={Boolean(errors.telefone)}
                autoComplete="tel"
                data-lead-field="telefone"
                id="linka-lead-telefone"
                inputMode="tel"
                onChange={(event) => updateField("telefone", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="+55 (54) 99999-9999"
                type="tel"
                value={formData.telefone}
              />
              {errors.telefone ? (
                <p className="linka-lead-error" id="telefone-error">
                  {errors.telefone}
                </p>
              ) : (
                <p className="linka-lead-hint" id="telefone-hint">
                  Aceita codigo do pais, espacos, parenteses, hifens e sinal de +.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">Etapa 4</span>
            <h2 id="linka-lead-modal-title">Sobre o negocio</h2>
            <div className="linka-lead-field">
              <label htmlFor="linka-lead-negocio">Negocio ou area de atuacao</label>
              <input
                aria-describedby={errors.negocio ? "negocio-error" : undefined}
                aria-invalid={Boolean(errors.negocio)}
                autoComplete="organization"
                data-lead-autofocus
                data-lead-field="negocio"
                id="linka-lead-negocio"
                onChange={(event) => updateField("negocio", event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ex.: clinica, loja, profissional liberal"
                type="text"
                value={formData.negocio}
              />
              {errors.negocio ? (
                <p className="linka-lead-error" id="negocio-error">
                  {errors.negocio}
                </p>
              ) : null}
            </div>
            {renderRadioGroup("servico", "Servico que voce procura", SERVICE_OPTIONS)}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="linka-lead-step">
            <span className="linka-lead-kicker">Etapa 5</span>
            <h2 id="linka-lead-modal-title">Faixa de investimento</h2>
            {renderRadioGroup("investimento", "Escolha uma referencia inicial", INVESTMENT_OPTIONS)}
          </div>
        ) : null}

        <div className="linka-lead-actions">
          <button className="linka-lead-secondary" disabled={step <= 1} onClick={goBack} type="button">
            Voltar
          </button>
          <button className="linka-lead-primary" type="submit">
            {step === TOTAL_STEPS ? "Ver horarios disponiveis" : "Continuar"}
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
          aria-label="Fechar formulario"
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
          <div className="linka-lead-progress" aria-label={`Etapa ${step} de ${TOTAL_STEPS}`}>
            <div>
              <span>Etapa</span>
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
