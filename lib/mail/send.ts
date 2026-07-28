import "server-only";

import { getTransporter } from "./transporter";

interface MailAttachment {
  filename: string;
  /** absolute filesystem path (nodemailer streams it — no need to read it in) */
  path?: string;
  /** or inline content, if not reading from disk */
  content?: Buffer | string;
  contentType?: string;
}

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  /** Set so hitting "Reply" in the inbox answers the enquirer, not the mailbox. */
  replyTo?: string;
  /** Plain-text alternative — improves deliverability and spam scoring. */
  text?: string;
  /** File attachments (e.g. a lead-magnet PDF). */
  attachments?: MailAttachment[];
}

/** Sender identity — a mailbox the SMTP account is allowed to send as. */
function from(): string {
  const address = process.env.MAIL_FROM?.trim() || process.env.SMTP_USER!;
  const name = process.env.MAIL_FROM_NAME?.trim();
  return name ? `"${name.replace(/"/g, "")}" <${address}>` : address;
}

export async function sendMail(options: SendMailOptions) {
  await getTransporter().sendMail({
    from: from(),
    ...options,
  });
}
