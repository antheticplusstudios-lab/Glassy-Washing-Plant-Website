import { emailShell, escapeHtml, sendEmail } from "./resend.server";

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
  const notifyEmail = settings["notifyEmail"] || "Shahglassy26@gmail.com";
  const from = settings["fromEmail"]
    ? `${settings["fromName"] || "Glassy Washing Plant"} <${settings["fromEmail"]}>`
    : undefined;

  const rows = [
    ["Name", brief.name],
    ["Email", brief.email],
    ["Brand", brief.brand ?? "—"],
    ["Needs", brief.service],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-size:12px;color:#8a7f76">${escapeHtml(
          label!,
        )}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(value!)}</td></tr>`,
    )
    .join("");

  const result = await sendEmail({
    to: notifyEmail,
    ...(from ? { from } : {}),
    replyTo: brief.email,
    subject: `New brief from ${brief.name}${brief.brand ? ` (${brief.brand})` : ""}`,
    html: emailShell(
      "New contact brief",
      `<table style="border-collapse:collapse">${rows}</table>
       <p style="margin:20px 0 6px;font-size:12px;color:#8a7f76">Message</p>
       <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(
         brief.message,
       )}</p>`,
    ),
    text: `${brief.name} <${brief.email}>\nBrand: ${brief.brand ?? "-"}\nNeeds: ${brief.service}\n\n${brief.message}`,
  });

  await supabaseAdmin
    .from("contact_submissions")
    .update({ email_delivery: result.sent ? "sent" : result.reason })
    .eq("id", inserted.id);

  return { ok: true as const, id: inserted.id, notified: result.sent };
}
