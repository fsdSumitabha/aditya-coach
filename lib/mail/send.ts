import "server-only";

import { getTransporter } from "./transporter";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  /** Set so hitting "Reply" in the inbox answers the enquirer, not the mailbox. */
  replyTo?: string;
  /** Plain-text alternative — improves deliverability and spam scoring. */
  text?: string;
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
