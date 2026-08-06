import type { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail/send";
import { missingMailEnv } from "@/lib/mail/transporter";
import { auditNotification } from "@/lib/mail/audit-templates";
import { sanitizeHeader } from "@/lib/mail/shell";
import { CONTACT_EMAIL } from "@/lib/config";

// nodemailer needs Node APIs (net/tls) — it cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NAME_MIN = 2;
const NAME_MAX = 120;
const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** A completed audit with a photo and a signature lands around 200–400 KB. */
const PDF_MAX_BYTES = 8 * 1024 * 1024;
const GOALS_MAX = 30;

/** Where completed audits land. Same fallback chain as the other handlers. */
function recipient(): string | undefined {
  return (
    process.env.AUDIT_TO_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    CONTACT_EMAIL.trim() ||
    process.env.SMTP_USER?.trim() ||
    undefined
  );
}

// --- Rate limiting (in-memory; per single instance) --------------------
// Same trade-off as app/api/contact: good enough to blunt a naive flood on a
// one-box deployment, not a substitute for a shared store behind a load
// balancer. Audits are long to fill in, so the window is tight.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

/** Strip anything that could escape the filename into a path or a header. */
function safeFileName(value: string): string {
  const cleaned = value
    .replace(/[\r\n]+/g, " ")
    .replace(/[\\/]+/g, "-")
    .replace(/[^A-Za-z0-9._ -]/g, "")
    .trim();
  const named = cleaned.length >= 5 ? cleaned : "Transformation-Audit.pdf";
  return named.toLowerCase().endsWith(".pdf") ? named.slice(0, 120) : `${named.slice(0, 116)}.pdf`;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed request body." }, 400);
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  const fullName = str(payload.fullName);
  const email = str(payload.email);
  const phone = str(payload.phone).slice(0, 40);
  const instagram = str(payload.instagram).slice(0, 80);
  const pdfBase64 = typeof payload.pdf === "string" ? payload.pdf : "";
  const goals = Array.isArray(payload.goals)
    ? payload.goals.filter((g): g is string => typeof g === "string").slice(0, GOALS_MAX)
    : [];

  const submittedAtRaw = str(payload.submittedAt);
  const submittedAt = Number.isNaN(Date.parse(submittedAtRaw))
    ? new Date().toISOString()
    : submittedAtRaw;

  if (fullName.length < NAME_MIN || fullName.length > NAME_MAX) {
    return json({ ok: false, error: "A name is required." }, 422);
  }
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "A valid email is required." }, 422);
  }
  // Base64 of "%PDF-" — cheap proof the payload is the document we generated
  // and not an arbitrary file being relayed through the mailbox.
  if (!pdfBase64.startsWith("JVBERi0")) {
    return json({ ok: false, error: "The audit file was not readable." }, 422);
  }

  let pdf: Buffer;
  try {
    pdf = Buffer.from(pdfBase64, "base64");
  } catch {
    return json({ ok: false, error: "The audit file was not readable." }, 422);
  }
  if (pdf.length === 0 || pdf.length > PDF_MAX_BYTES) {
    return json({ ok: false, error: "The audit file is too large to email." }, 413);
  }

  if (rateLimited(clientIp(request))) {
    return json(
      { ok: false, error: "Too many submissions from this connection. Try again shortly." },
      429,
    );
  }

  const to = recipient();
  const missing = missingMailEnv();
  if (missing.length > 0 || !to) {
    console.error(
      "[audit] mail not configured —",
      missing.length > 0 ? `missing env: ${missing.join(", ")}` : "no recipient address",
    );
    return json({ ok: false, error: "Mail is not configured on the server." }, 500);
  }

  const fileName = safeFileName(str(payload.fileName) || `Transformation-Audit-${fullName}.pdf`);
  const mail = auditNotification({
    fullName,
    email,
    phone,
    instagram,
    goals,
    fileName,
    submittedAt,
  });

  try {
    await sendMail({
      to,
      subject: sanitizeHeader(mail.subject),
      html: mail.html,
      text: mail.text,
      replyTo: `"${sanitizeHeader(fullName).replace(/"/g, "")}" <${email}>`,
      attachments: [{ filename: fileName, content: pdf, contentType: "application/pdf" }],
    });
  } catch (error) {
    console.error("[audit] failed to deliver the audit:", error);
    return json({ ok: false, error: "The audit could not be emailed." }, 502);
  }

  return json({ ok: true }, 200);
}
