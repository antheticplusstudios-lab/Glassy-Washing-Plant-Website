import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Inbox, MailCheck, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { getEmailStatus } from "@/lib/contact.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

type Row = { created_at: string; service: string; status: string; email_delivery: string | null };

function AdminOverview() {
  const emailStatus = useServerFn(getEmailStatus);

  const { data: rows } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("created_at, service, status, email_delivery")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const { data: userCount } = useQuery({
    queryKey: ["admin", "user-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: email } = useQuery({
    queryKey: ["admin", "email-status"],
    queryFn: () => emailStatus({}),
  });

  const all = rows ?? [];
  const now = Date.now();
  const last7 = all.filter((r) => now - new Date(r.created_at).getTime() < 7 * 864e5).length;
  const last30 = all.filter((r) => now - new Date(r.created_at).getTime() < 30 * 864e5).length;
  const replied = all.filter((r) => r.status === "replied").length;
  const pending = all.filter((r) => r.status === "new").length;
  const emailFailures = all.filter(
    (r) => r.email_delivery && r.email_delivery !== "sent" && r.email_delivery !== "pending",
  ).length;

  const byService = Object.entries(
    all.reduce<Record<string, number>>((acc, row) => {
      acc[row.service] = (acc[row.service] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const maxService = byService[0]?.[1] ?? 1;

  const days = Array.from({ length: 14 }, (_, index) => {
    const day = new Date(now - (13 - index) * 864e5);
    const key = day.toISOString().slice(0, 10);
    return {
      key,
      label: day.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      count: all.filter((row) => row.created_at.slice(0, 10) === key).length,
    };
  });
  const maxDay = Math.max(1, ...days.map((day) => day.count));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Inbox size={16} />} label="Total briefs" value={all.length} />
        <Stat icon={<MailCheck size={16} />} label="Replied" value={replied} />
        <Stat icon={<AlertTriangle size={16} />} label="Awaiting reply" value={pending} />
        <Stat icon={<Users size={16} />} label="Registered users" value={userCount ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Last 7 days" value={last7} />
        <Stat label="Last 30 days" value={last30} />
        <Stat label="Email failures" value={emailFailures} />
      </div>

      <section className="rounded-4xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Submissions — last 14 days</h2>
        <div className="mt-6 flex h-40 items-end gap-2">
          {days.map((day) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxDay) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                className="w-full min-h-1 rounded-t-lg bg-primary"
                title={`${day.count} on ${day.label}`}
              />
              <span className="text-[0.6rem] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Most requested services</h2>
        {byService.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">No submissions yet.</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {byService.map(([service, count]) => (
            <div key={service}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{service}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxService) * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-4xl border border-border bg-surface-1 p-6 sm:p-8">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          {email?.configured ? (
            <CheckCircle2 size={18} className="text-primary" />
          ) : (
            <AlertTriangle size={18} />
          )}
          Email delivery
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {email?.configured
            ? "Resend is connected. Notifications and replies are being emailed. Set a verified sending domain in Site content to send from your own address."
            : "Resend isn't configured yet. Briefs are still saved and replies are still recorded — add your RESEND_API_KEY and everything starts sending automatically."}
        </p>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      className="rounded-4xl border border-border bg-card p-6"
    >
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-extrabold">{value}</p>
    </motion.div>
  );
}
