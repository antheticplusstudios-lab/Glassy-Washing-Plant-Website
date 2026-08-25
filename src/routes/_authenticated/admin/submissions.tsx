import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { sendSubmissionReply } from "@/lib/contact.functions";
import { cn } from "@/lib/utils";
import { SubmissionTimeline, StatusPill } from "@/components/submission-timeline";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  component: AdminSubmissions,
});

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  brand: string | null;
  service: string;
  message: string;
  status: string;
  email_delivery: string | null;
  user_id: string | null;
  submission_replies: {
    id: string;
    created_at: string;
    subject: string;
    body: string;
    delivery_status: string | null;
  }[];
};

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

const STATUSES = ["new", "in_review", "replied", "archived"] as const;

function fillPlaceholders(text: string, row: Submission): string {
  return text
    .replaceAll("{{name}}", row.name)
    .replaceAll("{{service}}", row.service)
    .replaceAll("{{brand}}", row.brand ?? "")
    .replaceAll("{{email}}", row.email);
}

function AdminSubmissions() {
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const reply = useServerFn(sendSubmissionReply);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select(
          "id, created_at, name, email, brand, service, message, status, email_delivery, user_id, submission_replies(id, created_at, subject, body, delivery_status)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Submission[];
    },
  });

  const templates = useQuery({
    queryKey: ["admin", "email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("id, name, subject, body")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EmailTemplate[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const sendReply = useMutation({
    mutationFn: (input: { submissionId: string; subject: string; body: string }) =>
      reply({ data: input }),
    onSuccess: (result) => {
      toast.success(
        result.emailed
          ? "Reply sent by email."
          : "Reply saved. It will email once Resend is configured.",
      );
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rows = (data ?? []).filter((row) => filter === "all" || row.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors",
              filter === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground",
            )}
          >
            {value.replace("_", " ")}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading submissions…</p>}
      {!isLoading && rows.length === 0 && (
        <p className="rounded-4xl border border-border bg-surface-1 p-10 text-center text-sm text-muted-foreground">
          Nothing here yet.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {rows.map((row) => {
          const open = openId === row.id;
          return (
            <motion.article
              layout
              key={row.id}
              className="overflow-hidden rounded-4xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : row.id)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold">
                    {row.name}
                    {row.brand ? ` · ${row.brand}` : ""}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {row.service} · {new Date(row.created_at).toLocaleString()} · {row.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden sm:inline">
                    <StatusPill
                      input={{
                        createdAt: row.created_at,
                        status: row.status,
                        emailDelivery: row.email_delivery,
                        replies: row.submission_replies,
                      }}
                    />
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn("transition-transform", open && "rotate-180")}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-6 border-t border-border p-6 lg:grid-cols-[1fr_260px]">
                      <div className="min-w-0">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {row.message}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                          {STATUSES.map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={setStatus.isPending || row.status === status}
                              onClick={() => setStatus.mutate({ id: row.id, status })}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-semibold capitalize disabled:opacity-50",
                                row.status === status
                                  ? "border-primary bg-primary-container text-on-primary-container"
                                  : "border-border",
                              )}
                            >
                              {status.replace("_", " ")}
                            </button>
                          ))}
                          {row.email_delivery && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              Admin notice: {row.email_delivery}
                            </span>
                          )}
                        </div>

                        {row.submission_replies.length > 0 && (
                          <div className="mt-6 flex flex-col gap-2">
                            {row.submission_replies.map((item) => (
                              <div key={item.id} className="rounded-3xl bg-surface-2 p-4">
                                <p className="text-sm font-semibold">{item.subject}</p>
                                <p className="mt-1.5 text-sm whitespace-pre-wrap text-muted-foreground">
                                  {item.body}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {new Date(item.created_at).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <ReplyForm
                          pending={sendReply.isPending}
                          defaultSubject={`Re: your ${row.service.toLowerCase()} enquiry`}
                          templates={templates.data ?? []}
                          row={row}
                          onSend={(subject, body) =>
                            sendReply.mutate({ submissionId: row.id, subject, body })
                          }
                        />
                      </div>

                      <div>
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Status timeline
                        </p>
                        <SubmissionTimeline
                          input={{
                            createdAt: row.created_at,
                            status: row.status,
                            emailDelivery: row.email_delivery,
                            replies: row.submission_replies,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function ReplyForm({
  defaultSubject,
  pending,
  templates,
  row,
  onSend,
}: {
  defaultSubject: string;
  pending: boolean;
  templates: EmailTemplate[];
  row: Submission;
  onSend: (subject: string, body: string) => void;
}) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (body.trim().length < 2) {
          toast.error("Write a reply first.");
          return;
        }
        onSend(subject.trim(), body.trim());
        setBody("");
        setTemplateId("");
      }}
      className="mt-6 rounded-3xl border border-border bg-surface-1 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Reply to this client
        </p>
        {templates.length > 0 && (
          <select
            value={templateId}
            onChange={(event) => {
              const id = event.target.value;
              setTemplateId(id);
              const template = templates.find((t) => t.id === id);
              if (!template) return;
              setSubject(fillPlaceholders(template.subject, row));
              setBody(fillPlaceholders(template.body, row));
            }}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold outline-none focus:border-primary"
          >
            <option value="">Use a template…</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <input
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        placeholder="Subject"
        className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={5}
        placeholder="Write your reply…"
        className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        Send reply
      </button>
    </form>
  );
}
