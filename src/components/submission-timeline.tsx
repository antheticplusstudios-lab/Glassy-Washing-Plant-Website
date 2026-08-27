"use client";

import { motion } from "motion/react";
import { Check, Clock, Inbox, MailCheck, MessageSquareReply, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type TimelineInput = {
  createdAt: string;
  status: string;
  emailDelivery: string | null;
  replies: { created_at: string; delivery_status?: string | null }[];
};

type Step = {
  key: string;
  label: string;
  detail: string;
  state: "done" | "current" | "failed" | "todo";
  icon: typeof Check;
};

const fmt = (value: string) => new Date(value).toLocaleString();

/** Derives pending → delivered → replied states for one brief. */
export function buildTimeline(input: TimelineInput): Step[] {
  const lastReply = input.replies.length
    ? [...input.replies].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0]!
    : null;

  const delivery = (input.emailDelivery ?? "pending").toLowerCase();
  const deliveryFailed = delivery.includes("fail") || delivery.includes("error");
  const deliverySent = delivery === "sent" || delivery === "delivered";
  const deliverySkipped = delivery.includes("not_configured") || delivery.includes("skipped");

  const replySent =
    !!lastReply && (lastReply.delivery_status ?? "sent").toLowerCase() !== "failed";

  return [
    {
      key: "received",
      label: "Received",
      detail: fmt(input.createdAt),
      state: "done",
      icon: Inbox,
    },
    {
      key: "delivered",
      label: deliveryFailed ? "Notification failed" : "Delivered to plant",
      detail: deliveryFailed
        ? "Email notification could not be sent"
        : deliverySent
          ? "Admin notified by email"
          : deliverySkipped
            ? "Saved — email sending not live yet"
            : "Queued for delivery",
      state: deliveryFailed ? "failed" : deliverySent ? "done" : "current",
      icon: deliveryFailed ? TriangleAlert : MailCheck,
    },
    {
      key: "review",
      label: "In review",
      detail:
        input.status === "new"
          ? "Waiting for the costing team"
          : input.status === "archived"
            ? "Archived"
            : "Reviewed by the plant",
      state: input.status === "new" ? "current" : "done",
      icon: Clock,
    },
    {
      key: "replied",
      label: lastReply ? "Replied" : "Reply pending",
      detail: lastReply
        ? `${replySent ? "Sent" : "Saved"} ${fmt(lastReply.created_at)}`
        : "No reply sent yet",
      state: lastReply ? (replySent ? "done" : "failed") : "todo",
      icon: MessageSquareReply,
    },
  ];
}

const tone: Record<Step["state"], string> = {
  done: "bg-primary text-primary-foreground border-primary",
  current: "bg-primary-container text-on-primary-container border-primary/40",
  failed: "bg-destructive/10 text-destructive border-destructive/40",
  todo: "bg-surface-2 text-muted-foreground border-border",
};

export function SubmissionTimeline({ input }: { input: TimelineInput }) {
  const steps = buildTimeline(input);

  return (
    <ol className="mt-2 flex flex-col gap-0">
      {steps.map((step, i) => (
        <motion.li
          key={step.key}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
          className="relative flex gap-3 pb-4 last:pb-0"
        >
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className={cn(
                "absolute top-8 left-[15px] h-[calc(100%-1.5rem)] w-px",
                step.state === "done" ? "bg-primary/50" : "bg-border",
              )}
            />
          )}
          <span
            className={cn(
              "z-10 grid size-8 shrink-0 place-items-center rounded-full border",
              tone[step.state],
            )}
          >
            <step.icon size={14} />
          </span>
          <span className="min-w-0 pt-1">
            <span className="block text-sm font-semibold">{step.label}</span>
            <span className="block text-xs text-muted-foreground">{step.detail}</span>
          </span>
        </motion.li>
      ))}
    </ol>
  );
}

/** Small inline pill summarising where a brief stands. */
export function StatusPill({ input }: { input: TimelineInput }) {
  const steps = buildTimeline(input);
  const failed = steps.find((s) => s.state === "failed");
  const current = failed ?? [...steps].reverse().find((s) => s.state === "done");
  const label = failed ? failed.label : input.replies.length ? "Replied" : (current?.label ?? "Received");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        failed
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : input.replies.length
            ? "border-primary bg-primary-container text-on-primary-container"
            : "border-border bg-surface-2 text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
