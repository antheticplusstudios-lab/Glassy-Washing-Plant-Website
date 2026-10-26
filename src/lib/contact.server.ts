import {
  emailShell,
  escapeHtml,
  sendEmail,
  type SendEmailResult,
} from "./resend.server";

// In Resend sandbox mode, delivery is restricted to the account's own inbox.
// Configure RESEND_ACCOUNT_EMAIL in the environment to identify that inbox;
// do not silently send customer inquiries to a hard-coded developer address.
const ACCOUNT_OWNER_EMAIL = process.env["RESEND_ACCOUNT_EMAIL"]?.trim();

export type BriefRecord = {
  name: string;
  email: string;
  brand: string | null;
  service: string;
  message: string;
};

/** Stores a brief with the service-role client and notifies the admin inbox. */
export async function storeAndNotifyBrief(brief: BriefRecord, userId: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Keep the contact form usable if the database is temporarily unreachable:
  // an email notification is a safe fallback, while the response clearly
  // reports whether the brief was persisted to the database.
  let inserted: { id: string } | null = null;
  try {
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: brief.name,
        email: brief.email,
        brand: brief.brand,
        service: brief.service,
        message: brief.message,
        user_id: userId,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert failed for contact submission:", error);
    } else {
      inserted = data;
    }
  } catch (error) {
    console.error("Database unavailable for contact submission:", error);
  }

  // Contact notification settings are optional. If the CMS is offline,
  // continue with the server-side notification defaults.
  let settings: Record<string, string> = {};
  try {
    const { data: contact } = await supabaseAdmin
      .from("site_content")
      .select("value")
      .eq("key", "site.contact")
      .maybeSingle();
    settings = (contact?.value ?? {}) as Record<string, string>;
  } catch {
    console.warn("[contact] CMS unavailable; using server-side notification defaults.");
  }

  // Prefer explicit server-side settings. The Resend account inbox is only a
  // fallback; if neither address is set, record notification as not configured.
  const notifyEmail =
    process.env["BRIEF_NOTIFY_EMAIL"]?.trim() ||
    settings["notifyEmail"]?.trim() ||
    ACCOUNT_OWNER_EMAIL ||
    "";
  const from =
    process.env["RESEND_FROM_EMAIL"]?.trim() ||
    "Glassy Washing Plant <onboarding@resend.dev>";

  const rows = [
    ["Name", brief.name],
    ["Email", brief.email],
    ["Brand", brief.brand ?? "—"],
    ["Needs", brief.service],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-size:12px;color:#5b7a93">${escapeHtml(
          label!,
        )}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");

  const emailPayload = {
    ...(from ? { from } : {}),
    replyTo: brief.email,
    subject: `New brief from ${brief.name}${brief.brand ? ` (${brief.brand})` : ""}`,
    html: emailShell(
      "New contact brief",
      `<table style="border-collapse:collapse">${rows}</table>
       <p style="margin:20px 0 6px;font-size:12px;color:#5b7a93">Message</p>
       <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
         brief.message,
       )}</p>`,
    ),
    text: `${brief.name} <${brief.email}>\nBrand: ${brief.brand ?? "-"}\nNeeds: ${brief.service}\n\n${brief.message}`,
  };

  let result: SendEmailResult;
  if (!notifyEmail) {
    console.error(
      "[contact] No notification recipient configured; set BRIEF_NOTIFY_EMAIL or RESEND_ACCOUNT_EMAIL.",
    );
    result = { sent: false, reason: "not_configured" };
  } else {
    result = await sendEmail({ to: notifyEmail, ...emailPayload });
  }

  // Resend sandbox mode only delivers to the account owner's own inbox. If the
  // configured notify address fails and the account inbox is configured, retry there.
  if (
    !result.sent &&
    result.reason === "failed" &&
    ACCOUNT_OWNER_EMAIL &&
    notifyEmail.trim().toLowerCase() !== ACCOUNT_OWNER_EMAIL.toLowerCase()
  ) {
    result = await sendEmail({ to: ACCOUNT_OWNER_EMAIL, ...emailPayload });
  }

  if (inserted) {
    await supabaseAdmin
      .from("contact_submissions")
      .update({
        email_delivery: result.sent
          ? "sent"
          : `${result.reason}${result.error ? `: ${result.error}` : ""}`.slice(0, 500),
      })
      .eq("id", inserted.id);
  }

  // Never show a false success when both persistence and notification failed.
  if (!inserted && !result.sent) {
    console.error("Contact submission could not be stored or emailed.");
    throw new Error(
      "We couldn't send your brief right now. Please contact us by phone or WhatsApp instead.",
    );
  }

  return {
    ok: true as const,
    id: inserted?.id ?? null,
    notified: result.sent,
    stored: Boolean(inserted),
  };
}
