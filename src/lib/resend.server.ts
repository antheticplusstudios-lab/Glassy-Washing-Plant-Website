/**
 * Resend email transport (server only).
 *
 * The API key lives in the RESEND_API_KEY environment secret. Until it is set,
 * every send resolves with `{ sent: false, reason: "not_configured" }` so the
 * app keeps working (submissions are still stored, replies are still logged)
 * and starts sending the moment the key + verified domain are in place.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "not_configured" | "failed"; error?: string };

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
};

export function isResendConfigured(): boolean {
  return Boolean(process.env["RESEND_API_KEY"]);
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("[resend] RESEND_API_KEY is not set — skipping email send.");
    return { sent: false, reason: "not_configured" };
  }

  const from =
    input.from ??
    process.env["RESEND_FROM_EMAIL"] ??
    "Glassy Washing Plant <onboarding@resend.dev>";

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[resend] send failed [${response.status}]: ${body}`);
      return { sent: false, reason: "failed", error: `${response.status}: ${body}` };
    }

    const payload = (await response.json()) as { id?: string };
    return { sent: true, id: payload.id ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[resend] send threw: ${message}`);
    return { sent: false, reason: "failed", error: message };
  }
}

const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

export function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Helvetica,Arial,sans-serif;color:#1c1b1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7f76">Glassy Washing Plant</p>
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.25">${escapeHtml(title)}</h1>
    ${bodyHtml}
    <hr style="margin:28px 0 12px;border:none;border-top:1px solid #e6e1dc" />
    <p style="margin:0;font-size:11px;color:#8a7f76">Glassy Washing Plant · House 13, Wazuddin Rd, Vatara, Dhaka 1212</p>
  </div></body></html>`;
}
