import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Inbox,
  KeyRound,
  Loader2,
  MailCheck,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { SubmissionTimeline, StatusPill } from "@/components/submission-timeline";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Glassy Washing Plant" },
      {
        name: "description",
        content:
          "Manage your Glassy Washing Plant account details, password and the wash briefs you sent us.",
      },
      { property: "og:title", content: "Your profile — Glassy Washing Plant" },
      { property: "og:description", content: "Your account details, briefs and replies." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [password, setPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [openBriefId, setOpenBriefId] = useState<string | null>(null);

  const profile = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const submissions = useQuery({
    queryKey: ["my-submissions-summary", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select(
          "id, created_at, service, status, email_delivery, submission_replies(id, created_at, delivery_status)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (profile.data?.full_name) setFullName(profile.data.full_name);
  }, [profile.data?.full_name]);

  async function saveName() {
    if (!user) return;
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setSavingName(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated.");
    void queryClient.invalidateQueries({ queryKey: ["my-profile", user.id] });
  }

  async function savePassword() {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    toast.success("Password changed.");
  }

  const rows = submissions.data ?? [];
  const replied = rows.filter((row) => (row.submission_replies?.length ?? 0) > 0).length;

  return (
    <div className="container-site py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      >
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl">
          {profile.data?.full_name || "Welcome back"}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Signed in as <strong>{user?.email}</strong>
          {profile.data?.created_at
            ? ` · member since ${new Date(profile.data.created_at).toLocaleDateString()}`
            : ""}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            All briefs & replies <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold"
          >
            Send a new brief
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

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Briefs sent", value: rows.length, icon: Inbox },
          { label: "Replied", value: replied, icon: MailCheck },
          { label: "Open", value: rows.length - replied, icon: UserIcon },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="rounded-4xl border border-border bg-card p-6"
          >
            <stat.icon size={16} className="text-muted-foreground" />
            <p className="mt-3 font-display text-3xl font-extrabold">{stat.value}</p>
            <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-4xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Profile details</h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Full name
            </span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Email
            </span>
            <input
              value={user?.email ?? ""}
              readOnly
              className="w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground"
            />
          </label>
          <button
            type="button"
            onClick={() => void saveName()}
            disabled={savingName}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {savingName && <Loader2 size={15} className="animate-spin" />} Save profile
          </button>
        </section>

        <section className="rounded-4xl border border-border bg-card p-6 sm:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <KeyRound size={17} /> Change password
          </h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              New password
            </span>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="button"
            onClick={() => void savePassword()}
            disabled={savingPassword}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {savingPassword && <Loader2 size={15} className="animate-spin" />} Update password
          </button>
        </section>
      </div>

      <section className="mt-6 rounded-4xl border border-border bg-surface-1 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Recent briefs</h2>
        {submissions.isLoading && (
          <p className="mt-4 text-sm text-muted-foreground">Loading your briefs…</p>
        )}
        {!submissions.isLoading && rows.length === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Nothing yet — your first brief will appear here.
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {rows.slice(0, 5).map((row) => {
            const open = openBriefId === row.id;
            const timelineInput = {
              createdAt: row.created_at,
              status: row.status,
              emailDelivery: row.email_delivery,
              replies: row.submission_replies,
            };
            return (
              <div key={row.id} className="overflow-hidden rounded-2xl bg-card">
                <button
                  type="button"
                  onClick={() => setOpenBriefId(open ? null : row.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold">{row.service}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString()}
                    <StatusPill input={timelineInput} />
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform", open && "rotate-180")}
                    />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <SubmissionTimeline input={timelineInput} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
