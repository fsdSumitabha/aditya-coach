import type { NextRequest } from "next/server";
import { sendMail } from "@/lib/mail/send";
import { missingMailEnv } from "@/lib/mail/transporter";
import {
  bookingIntakeNotification,
  bookingNotification,
  type BookingSubmission,
} from "@/lib/mail/booking-templates";
import { sanitizeHeader } from "@/lib/mail/shell";
import { CONTACT_EMAIL } from "@/lib/config";
import { LEGAL, UPI } from "@/lib/legal";

// nodemailer needs Node APIs (net/tls) — it cannot run on the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /book submissions → Aditya's inbox.
 *
 * This handler is the entire booking record. There is no CRM and no gateway
 * webhook: a man pays over UPI and the only thing tying that ₹999 to a person
 * is the mail this route sends. If it fails, the client is told so and pushed
 * to WhatsApp — it must never fail silently.
 */

const NAME_MIN = 2;
const NAME_MAX = 120;
const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Same loose rule the client uses — PSPs return their own reference formats. */
const UTR_RE = /^[A-Za-z0-9]{6,25}$/;
/** Free-text intake answers: generous, but not an open relay for essays. */
const TEXT_MAX = 2000;

/** Where bookings land. Same fallback chain as the other handlers. */
function recipient(): string | undefined {
  return (
    process.env.BOOKING_TO_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    CONTACT_EMAIL.trim() ||
    process.env.SMTP_USER?.trim() ||
    undefined
  );
}

// --- Rate limiting (in-memory; per single instance) --------------------
// Same trade-off as app/api/contact and app/api/audit: enough to blunt a naive
// flood on a one-box deployment, not a substitute for a shared store behind a
// load balancer. Two stages per booking, so the cap allows a few real retries.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
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
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

  const stage = str(payload.stage) === "intake" ? "intake" : "paid";
  const name = str(payload.name);
  const email = str(payload.email);
  const phone = str(payload.phone).slice(0, 40);
  const age = str(payload.age).slice(0, 8);
  const goal = str(payload.goal).slice(0, 80);
  const upiReference = str(payload.upiReference).slice(0, 40);

  const submittedAtRaw = str(payload.submittedAt);
  const submittedAt = Number.isNaN(Date.parse(submittedAtRaw))
    ? new Date().toISOString()
    : submittedAtRaw;

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return json({ ok: false, error: "A name is required." }, 422);
  }
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "A valid email is required." }, 422);
  }
  if (!UTR_RE.test(upiReference)) {
    return json({ ok: false, error: "A valid UPI reference is required." }, 422);
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
      "[booking] mail not configured —",
      missing.length > 0 ? `missing env: ${missing.join(", ")}` : "no recipient address",
    );
    return json({ ok: false, error: "Mail is not configured on the server." }, 500);
  }

  // The amount and the payee are read from the server's own constants, never
  // from the request — a client-supplied amount could put any figure in front
  // of Aditya and make a ₹1 payment look like a ₹999 one.
  const submission: BookingSubmission = {
    name,
    email,
    phone,
    age,
    goal,
    upiReference,
    amountLabel: LEGAL.CONSULT_PRICE,
    upiId: UPI.ID,
    submittedAt,
  };

  const mail =
    stage === "intake"
      ? bookingIntakeNotification(submission, {
          occupation: str(payload.occupation).slice(0, TEXT_MAX),
          lifestyle: str(payload.lifestyle).slice(0, TEXT_MAX),
          training: str(payload.training).slice(0, TEXT_MAX),
          blocker: str(payload.blocker).slice(0, TEXT_MAX),
          success: str(payload.success).slice(0, TEXT_MAX),
        })
      : bookingNotification(submission);

  try {
    await sendMail({
      to,
      subject: sanitizeHeader(mail.subject),
      html: mail.html,
      text: mail.text,
      // Hitting Reply answers the man who booked, not the mailbox.
      replyTo: `"${sanitizeHeader(name).replace(/"/g, "")}" <${email}>`,
    });
  } catch (error) {
    console.error(`[booking] failed to deliver the ${stage} notification:`, error);
    return json({ ok: false, error: "The booking could not be emailed." }, 502);
  }

  return json({ ok: true }, 200);
}
