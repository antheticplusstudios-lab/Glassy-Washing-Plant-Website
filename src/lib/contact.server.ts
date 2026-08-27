import { emailShell, escapeHtml, sendEmail } from "./resend.server";

// Resend isn't on a verified domain yet, so sandbox mode will only deliver to
// the current API key's own account inbox. RESEND_ACCOUNT_EMAIL should always
// match whichever email that Resend account (RESEND_API_KEY) is signed up
// under — update it in Vercel, not here, if you ever switch keys. Once a
// domain is verified at resend.com/domains, BRIEF_NOTIFY_EMAIL or the "Admin
// notification inbox" content setting can point anywhere again.
const ACCOUNT_OWNER_EMAIL =
  process.env["RESEND_ACCOUNT_EMAIL"]?.trim() || "antheticplusstudios@gmail.com";

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

  const { data: inserted, error } = await supabaseAdmin
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
    throw new Error("We couldn't save your brief. Please try again in a moment.");
  }

  const { data: contact } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "site.contact")
    .maybeSingle();

  const settings = (contact?.value ?? {}) as Record<string, string>;

  // Admin brief notifications are controlled server-side so a stale Supabase
  // contact setting cannot silently route the message to the wrong inbox or
  // use an unverified sender. For testing, these fall back to the AntheticPlus
  // Resend account inbox and Resend's testing sender. Before client launch,
  // set BRIEF_NOTIFY_EMAIL and RESEND_FROM_EMAIL in Vercel to the client's
  // production values.
  const notifyEmail =
    process.env["BRIEF_NOTIFY_EMAIL"]?.trim() ||
    settings["notifyEmail"]?.trim() ||
    ACCOUNT_OWNER_EMAIL;
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

  let result = await sendEmail({ to: notifyEmail, ...emailPayload });

  // Resend sandbox mode only delivers to the account owner's own inbox. If the
  // configured notify address is anything else and that's why the send failed,
  // retry against the account inbox so a brief never goes unnoticed.
  if (!result.sent && result.reason === "failed" && notifyEmail.trim().toLowerCase() !== ACCOUNT_OWNER_EMAIL) {
    result = await sendEmail({ to: ACCOUNT_OWNER_EMAIL, ...emailPayload });
  }

  await supabaseAdmin
    .from("contact_submissions")
    .update({
      email_delivery: result.sent
        ? "sent"
        : `${result.reason}${result.error ? `: ${result.error}` : ""}`.slice(0, 500),
    })
    .eq("id", inserted.id);

  return { ok: true as const, id: inserted.id, notified: result.sent };
}
