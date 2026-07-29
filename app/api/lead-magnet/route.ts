import type { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail/send";
import { missingMailEnv } from "@/lib/mail/transporter";
import {
  resolveResource,
  resolveAttachment,
} from "@/lib/mail/resources";
import {
  leadMagnetDelivery,
  leadAdminNotification,
} from "@/lib/mail/lead-templates";
import { sanitizeHeader } from "@/lib/mail/shell";
import { CONTACT_EMAIL, BASE_PATH } from "@/lib/config";
import { SITE_ORIGIN } from "@/lib/site";

// nodemailer + fs need Node APIs — this cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Where lead notifications land (admin). */
function adminRecipient(): string | undefined {
  return (
    process.env.LEADS_TO_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    CONTACT_EMAIL.trim() ||
    process.env.SMTP_USER?.trim() ||
    undefined
  );
}

// --- Rate limiting (in-memory; per single instance) --------------------
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
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

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Malformed request body." }, 400);
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const email = str(payload.email);
  const source = str(payload.source) || "lead-magnet";
  const resourceKey = str(payload.resource);
  const pdfHref = str(payload.pdfHref);
  const honeypot = str(payload.company);

  // Honeypot tripped → report success and drop it.
  if (honeypot) return json({ ok: true }, 200);

  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return json(
      {
        ok: false,
        errors: {
          email:
            "That doesn't look like a valid email. Check it and try again.",
        },
      },
      422,
    );
  }

  if (rateLimited(clientIp(request))) {
    return json(
      {
        ok: false,
        error: "Too many requests from this connection. Try again shortly.",
      },
      429,
    );
  }

  const admin = adminRecipient();
  const missing = missingMailEnv();
  if (missing.length > 0 || !admin) {
    console.error(
      "[lead-magnet] mail not configured —",
      missing.length > 0
        ? `missing env: ${missing.join(", ")}`
        : "no admin recipient",
    );
    return json({ ok: false, error: "Mail is not configured on the server." }, 500);
  }

  const resource = resolveResource({ resource: resourceKey, source });
  const { absPath, ready } = resolveAttachment(resource);
  if (!ready) {
    console.warn(
      `[lead-magnet] no attachable PDF for "${resource.id}" at ${absPath} — sending confirmation without attachment.`,
    );
  }

  const receivedAt = new Date().toISOString();
  const pdfUrl = pdfHref.startsWith("/")
    ? `${SITE_ORIGIN}${pdfHref}`
    : undefined;
  const bookUrl = `${SITE_ORIGIN}${BASE_PATH}/book`;

  // 1) Deliver the guide to the subscriber (primary action).
  let delivered = false;
  try {
    const mail = leadMagnetDelivery({ resource, attached: ready, pdfUrl, bookUrl });
    await sendMail({
      to: email,
      subject: sanitizeHeader(mail.subject),
      html: mail.html,
      text: mail.text,
      replyTo: admin,
      attachments: ready
        ? [{ filename: resource.downloadName, path: absPath, contentType: "application/pdf" }]
        : undefined,
    });
    delivered = true;
  } catch (error) {
    console.error("[lead-magnet] delivery to subscriber failed:", error);
  }

  // 2) Notify the admin (best-effort — always fire so the lead is captured,
  //    and flag whether delivery actually succeeded).
  try {
    const notice = leadAdminNotification({
      resource,
      delivered,
      meta: {
        email,
        source,
        receivedAt,
        ip: clientIp(request),
        userAgent: request.headers.get("user-agent") ?? undefined,
        referer: request.headers.get("referer") ?? undefined,
      },
    });
    await sendMail({
      to: admin,
      subject: sanitizeHeader(notice.subject),
      html: notice.html,
      text: notice.text,
      replyTo: `<${email}>`,
    });
  } catch (error) {
    console.error("[lead-magnet] admin notification failed:", error);
  }

  if (!delivered) {
    return json(
      { ok: false, error: "We couldn't email your guide. Please try again." },
      502,
    );
  }

  return json({ ok: true }, 200);
}
