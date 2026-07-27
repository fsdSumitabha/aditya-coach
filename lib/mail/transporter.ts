import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transport (server-only). Created lazily and cached on first use —
 * building it at module scope would throw during `next build`, when the SMTP
 * env vars are typically absent.
 */
let cached: Transporter | null = null;

const REQUIRED = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

/** Names of the required SMTP env vars that are missing or empty. */
export function missingMailEnv(): string[] {
  return REQUIRED.filter((key) => !process.env[key]?.trim());
}

export function getTransporter(): Transporter {
  const missing = missingMailEnv();
  if (missing.length > 0) {
    throw new Error(`Mail is not configured — missing env: ${missing.join(", ")}`);
  }

  if (!cached) {
    const port = Number(process.env.SMTP_PORT);
    cached = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465 is implicit TLS; 587/2525 start plaintext and upgrade via STARTTLS.
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return cached;
}
