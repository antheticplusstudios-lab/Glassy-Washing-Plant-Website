import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { contactFormSchema } from "./contact-schema";

/** Real users take longer than this to fill the form out. */
const MIN_SUBMIT_MS = 3000;

const submitPayloadSchema = contactFormSchema.extend({
  honeypot: z.string().max(0, "Spam check failed.").optional().default(""),
  elapsedMs: z.number().nonnegative(),
  mathA: z.number(),
  mathB: z.number(),
  mathAnswer: z.number(),
});

type SubmitPayload = z.infer<typeof submitPayloadSchema>;

function guard(data: SubmitPayload) {
  if (data.honeypot) throw new Error("Submission rejected.");
  if (data.elapsedMs < MIN_SUBMIT_MS) throw new Error("Submission rejected.");
  if (data.mathA + data.mathB !== data.mathAnswer) {
    throw new Error("That answer doesn't look right — please try the math check again.");
  }
  return {
    name: data.name,
    email: data.email,
    brand: data.brand ? data.brand : null,
    service: data.service,
    message: data.message,
  };
}

export const submitContactBrief = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submitPayloadSchema.parse(data))
  .handler(async ({ data }) => {
    const { storeAndNotifyBrief } = await import("./contact.server");
    return storeAndNotifyBrief(guard(data), null);
  });

export const submitContactBriefAsUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => submitPayloadSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { storeAndNotifyBrief } = await import("./contact.server");
    return storeAndNotifyBrief(guard(data), context.userId);
  });

const replySchema = z.object({
  submissionId: z.string().uuid(),
  subject: z.string().trim().min(2).max(180),
  body: z.string().trim().min(2).max(5000),
});

/** Admin-only: log a reply and email it to the person who sent the brief. */
export const sendSubmissionReply = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => replySchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { sendReplyToSubmitter } = await import("./replies.server");
    return sendReplyToSubmitter({
      submissionId: data.submissionId,
      subject: data.subject,
      body: data.body,
      authorId: context.userId,
    });
  });

/** Admin-only: is email sending live yet? */
export const getEmailStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { isResendConfigured } = await import("./resend.server");
    return { configured: isResendConfigured() };
  });
