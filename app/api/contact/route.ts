import type { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail/send";
import { missingMailEnv } from "@/lib/mail/transporter";
import { coachNotification, enquiryAutoReply, sanitizeHeader } from "@/lib/mail/templates";
import { CONTACT_EMAIL, waLink } from "@/lib/config";
import { SITE_ORIGIN } from "@/lib/site";

// nodemailer needs Node APIs (net/tls) — it cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NAME_MIN = 2;
const NAME_MAX = 120;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000; // mirrors the textarea maxlength in ContactForm
const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RESPONSE_TIME = "within 24 hours"; // mirrors RESPONSE_TIME on /contact
const WA_CONTACT_LINK = waLink(
  "Hi Aditya, I just sent an enquiry through your site and wanted to follow up here.",
);

/** Where enquiries land. Falls back to the public contact address, then the SMTP mailbox. */
function recipient(): string | undefined {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    CONTACT_EMAIL.trim() ||
    process.env.SMTP_USER?.trim() ||
    undefined
  );
}

// --- Rate limiting -----------------------------------------------------
// Deliberately in-memory: it survives a single server instance, not a restart
// or a second replica. Enough to blunt a naive flood on a one-box deployment;
// swap for a shared store (Redis/Upstash) if the site is ever scaled out.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
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
    // Bounded cleanup so the map can't grow without limit.
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
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  const name = str(payload.name);
  const email = str(payload.email);
  const message = str(payload.message);
  const source = str(payload.source) || "contact";
  const honeypot = str(payload.company);

  // Honeypot tripped → report success and drop it. Telling a bot it failed
  // only teaches it to retry differently.
  if (honeypot) return json({ ok: true }, 200);

  const errors: Record<string, string> = {};
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = "Please enter your name — at least 2 characters.";
  }
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    errors.email = "That doesn't look like a valid email. Check it and try again.";
  }
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    errors.message = "Give me a little more to go on — at least 10 characters.";
  }
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 422);
  }

  if (rateLimited(clientIp(request))) {
    return json(
      { ok: false, error: "Too many messages from this connection. Try again shortly." },
      429,
    );
  }

  const to = recipient();
  const missing = missingMailEnv();
  if (missing.length > 0 || !to) {
    console.error(
      "[contact] mail not configured —",
      missing.length > 0 ? `missing env: ${missing.join(", ")}` : "no recipient address",
    );
    return json({ ok: false, error: "Mail is not configured on the server." }, 500);
  }

  const enquiry = {
    name,
    email,
    message,
    source,
    receivedAt: new Date().toISOString(),
  };

  // The coach notification is the one that must land — if it throws, the
  // submitter sees the error path and the WhatsApp/email fallback.
  try {
    const mail = coachNotification(enquiry);
    await sendMail({
      to,
      subject: sanitizeHeader(mail.subject),
      html: mail.html,
      text: mail.text,
      replyTo: `"${sanitizeHeader(name).replace(/"/g, "")}" <${email}>`,
    });
  } catch (error) {
    console.error("[contact] failed to send enquiry notification:", error);
    return json({ ok: false, error: "Your message couldn't be sent." }, 502);
  }

  // Auto-reply is best-effort — the lead is already captured, so a bounce here
  // must not turn a delivered enquiry into a visible failure.
  try {
    const reply = enquiryAutoReply(enquiry, {
      responseTime: RESPONSE_TIME,
      waHref: WA_CONTACT_LINK,
      siteOrigin: SITE_ORIGIN,
    });
    await sendMail({
      to: email,
      subject: reply.subject,
      html: reply.html,
      text: reply.text,
      replyTo: to,
    });
  } catch (error) {
    console.error("[contact] auto-reply failed (enquiry was delivered):", error);
  }

  return json({ ok: true }, 200);
}
