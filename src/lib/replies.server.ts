import { emailShell, escapeHtml, sendEmail } from "./resend.server";

export async function sendReplyToSubmitter(input: {
  submissionId: string;
  subject: string;
  body: string;
  authorId: string;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: submission, error: loadError } = await supabaseAdmin
    .from("contact_submissions")
    .select("id, name, email")
    .eq("id", input.submissionId)
    .single();

  if (loadError || !submission) {
    throw new Error("That submission no longer exists.");
  }

  const { data: contact } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", "site.contact")
    .maybeSingle();
  const settings = (contact?.value ?? {}) as Record<string, string>;
  const from = settings["fromEmail"]
    ? `${settings["fromName"] || "Glassy Washing Plant"} <${settings["fromEmail"]}>`
    : undefined;

  const result = await sendEmail({
    to: submission.email,
    ...(from ? { from } : {}),
    replyTo: settings["notifyEmail"] || "Shahglassy26@gmail.com",
    subject: input.subject,
    html: emailShell(
      input.subject,
      `<p style="margin:0 0 16px;font-size:14px">Hi ${escapeHtml(submission.name)},</p>
       <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(
         input.body,
       )}</p>`,
    ),
    text: `Hi ${submission.name},\n\n${input.body}`,
  });

  const status = result.sent ? "sent" : result.reason;

  const { error: insertError } = await supabaseAdmin.from("submission_replies").insert({
    submission_id: submission.id,
    author_id: input.authorId,
    subject: input.subject,
    body: input.body,
    delivery_status: status,
    delivery_error: result.sent ? null : (result.error ?? null),
    provider_id: result.sent ? result.id : null,
  });

  if (insertError) {
    console.error("Failed to log reply:", insertError);
    throw new Error("The reply could not be saved.");
  }

  await supabaseAdmin
    .from("contact_submissions")
    .update({ status: "replied" })
    .eq("id", submission.id);

  return {
    ok: true as const,
    emailed: result.sent,
    reason: result.sent ? null : result.reason,
  };
}
