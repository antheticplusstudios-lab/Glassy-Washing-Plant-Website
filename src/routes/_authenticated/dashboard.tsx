import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowRight, Inbox, MailCheck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { StatusPill, SubmissionTimeline } from "@/components/submission-timeline";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex,nofollow,noarchive" },
      { title: "Your briefs — Glassy Washing Plant" },
      {
        name: "description",
        content: "Track the wash briefs you sent to Glassy Washing Plant and read our replies.",
      },
      { property: "og:title", content: "Your briefs — Glassy Washing Plant" },
      { property: "og:description", content: "Track your briefs and replies in one place." },
    ],
  }),
  component: Dashboard,
});

type Submission = {
  id: string;
  created_at: string;
  service: string;
  brand: string | null;
  message: string;
  status: string;
  email_delivery: string | null;
  submission_replies: {
    id: string;
    created_at: string;
    subject: string;
    body: string;
    delivery_status: string | null;
  }[];
};

function Dashboard() {
  const { user, isAdmin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-submissions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select(
          "id, created_at, service, brand, message, status, email_delivery, submission_replies(id, created_at, subject, body, delivery_status)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Submission[];
    },
  });

  return (
    <div className="container-site py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      >
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl">
          Briefs & replies
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Everything you sent us, plus every reply from the plant floor. Signed in as{" "}
          <strong>{user?.email}</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Send a new brief <ArrowRight size={16} />
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold"
            >
              Admin panel
            </Link>
          )}
        </div>
      </motion.div>

      <div className="mt-12 flex flex-col gap-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading your briefs…</p>}

        {!isLoading && (data?.length ?? 0) === 0 && (
          <div className="rounded-4xl border border-border bg-surface-1 p-10 text-center">
            <Inbox className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              No briefs yet. Send your first one and it will show up here.
            </p>
          </div>
        )}

        {data?.map((submission, index) => (
          <motion.article
            key={submission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
            className="rounded-4xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">{submission.service}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(submission.created_at).toLocaleString()}
                  {submission.brand ? ` · ${submission.brand}` : ""}
                </p>
              </div>
              <StatusPill
                input={{
                  createdAt: submission.created_at,
                  status: submission.status,
                  emailDelivery: submission.email_delivery,
                  replies: submission.submission_replies,
                }}
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {submission.message}
            </p>

            <div className="mt-6 rounded-3xl border border-border bg-surface-1 p-5">
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Status timeline
              </p>
              <SubmissionTimeline
                input={{
                  createdAt: submission.created_at,
                  status: submission.status,
                  emailDelivery: submission.email_delivery,
                  replies: submission.submission_replies,
                }}
              />
            </div>


            {submission.submission_replies.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
                {submission.submission_replies.map((reply) => (
                  <div key={reply.id} className="rounded-3xl bg-primary-container/50 p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <MailCheck size={15} /> {reply.subject}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(reply.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
