import { NextResponse } from "next/server";

type LeadLanguage = "pt" | "en" | "es";

type LeadPayload = {
  nome: string;
  email: string;
  pais: string;
  codigoPais: string;
  telefone: string;
  telefoneE164: string;
  negocio: string;
  servico: string;
  investimento: string;
  idioma: LeadLanguage;
  origem: string;
  pageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
const ALLOWED_LANGUAGES = new Set<LeadLanguage>(["pt", "en", "es"]);
const WEBHOOK_TIMEOUT_MS = 10000;

const FIELD_LIMITS = {
  nome: 120,
  email: 180,
  pais: 2,
  codigoPais: 8,
  telefone: 40,
  telefoneE164: 16,
  negocio: 180,
  servico: 80,
  investimento: 80,
  origem: 80,
  pageUrl: 600,
  utmSource: 140,
  utmMedium: 140,
  utmCampaign: 180,
} satisfies Record<Exclude<keyof LeadPayload, "idioma">, number>;

const REQUIRED_FIELDS = [
  "nome",
  "email",
  "pais",
  "codigoPais",
  "telefone",
  "telefoneE164",
  "negocio",
  "servico",
  "investimento",
  "idioma",
  "origem",
  "pageUrl",
] satisfies Array<keyof LeadPayload>;

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function createPayload(input: Record<string, unknown>): LeadPayload {
  return {
    nome: textValue(input.nome),
    email: textValue(input.email),
    pais: textValue(input.pais).toUpperCase(),
    codigoPais: textValue(input.codigoPais),
    telefone: textValue(input.telefone),
    telefoneE164: textValue(input.telefoneE164),
    negocio: textValue(input.negocio),
    servico: textValue(input.servico),
    investimento: textValue(input.investimento),
    idioma: textValue(input.idioma) as LeadLanguage,
    origem: textValue(input.origem),
    pageUrl: textValue(input.pageUrl),
    utmSource: textValue(input.utmSource),
    utmMedium: textValue(input.utmMedium),
    utmCampaign: textValue(input.utmCampaign),
  };
}

function validatePayload(payload: LeadPayload) {
  const errors: string[] = [];

  REQUIRED_FIELDS.forEach((field) => {
    if (!payload[field]) errors.push(`${field} is required`);
  });

  Object.entries(FIELD_LIMITS).forEach(([field, maxLength]) => {
    const value = payload[field as keyof typeof FIELD_LIMITS];
    if (value.length > maxLength) errors.push(`${field} is too long`);
  });

  if (payload.email && !EMAIL_PATTERN.test(payload.email)) {
    errors.push("email is invalid");
  }

  if (payload.idioma && !ALLOWED_LANGUAGES.has(payload.idioma)) {
    errors.push("idioma is invalid");
  }

  if (payload.telefoneE164 && !E164_PATTERN.test(payload.telefoneE164)) {
    errors.push("telefoneE164 is invalid");
  }

  if (payload.pais && !/^[A-Z]{2}$/.test(payload.pais)) {
    errors.push("pais is invalid");
  }

  if (payload.codigoPais && !/^\+\d{1,4}$/.test(payload.codigoPais)) {
    errors.push("codigoPais is invalid");
  }

  try {
    if (payload.pageUrl) new URL(payload.pageUrl);
  } catch {
    errors.push("pageUrl is invalid");
  }

  return errors;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, error: "lead_webhook_not_configured" },
      { status: 503 },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const payload = createPayload(input as Record<string, unknown>);
  const errors = validatePayload(payload);

  if (errors.length) {
    return NextResponse.json({ ok: false, error: "validation_error", fields: errors }, { status: 400 });
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });

    if (!webhookResponse.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[leads] webhook failed", webhookResponse.status);
      }

      return NextResponse.json(
        { ok: false, error: "webhook_error" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[leads] webhook request failed", error instanceof Error ? error.name : "unknown");
    }

    const errorName = error instanceof Error ? error.name : "";
    return NextResponse.json(
      { ok: false, error: errorName === "AbortError" ? "webhook_timeout" : "webhook_unavailable" },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
