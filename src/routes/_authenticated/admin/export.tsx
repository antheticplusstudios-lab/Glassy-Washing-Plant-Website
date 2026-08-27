import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Download, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, stamp, toCsv } from "@/lib/csv";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/export")({
  component: AdminExport,
});

type Row = {
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
  submission_replies: { id: string; created_at: string; subject: string; body: string }[];
};

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
};

const STATUSES = ["all", "new", "in_review", "replied", "archived"] as const;

const field =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function AdminExport() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select(
          "id, created_at, name, email, brand, service, message, status, email_delivery, user_id, submission_replies(id, created_at, subject, body)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : null;
  const toTime = to ? new Date(`${to}T23:59:59`).getTime() : null;
  const term = search.trim().toLowerCase();

  const inRange = (iso: string) => {
    const t = new Date(iso).getTime();
    if (fromTime !== null && t < fromTime) return false;
    if (toTime !== null && t > toTime) return false;
    return true;
  };

  const filteredSubmissions = useMemo(
    () =>
      (submissions ?? []).filter((row) => {
        if (!inRange(row.created_at)) return false;
        if (status !== "all" && row.status !== status) return false;
        if (!term) return true;
        return [row.name, row.email, row.brand ?? "", row.service, row.message]
          .join(" ")
          .toLowerCase()
          .includes(term);
      }),
    [submissions, fromTime, toTime, status, term],
  );

  const filteredProfiles = useMemo(
    () =>
      (profiles ?? []).filter((profile) => {
        if (!inRange(profile.created_at)) return false;
        if (!term) return true;
        return [profile.full_name ?? "", profile.email ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(term);
      }),
    [profiles, fromTime, toTime, term],
  );

  const exportSubmissions = () => {
    if (filteredSubmissions.length === 0) {
      toast.error("No submissions match these filters.");
      return;
    }
    const csv = toCsv(
      [
        "Submitted at",
        "Name",
        "Email",
        "Brand",
        "Service",
        "Status",
        "Admin notification",
        "Replies",
        "Last reply at",
        "Registered user",
        "Message",
      ],
      filteredSubmissions.map((row) => {
        const last = [...row.submission_replies].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0];
        return [
          new Date(row.created_at).toISOString(),
          row.name,
          row.email,
          row.brand ?? "",
          row.service,
          row.status,
          row.email_delivery ?? "pending",
          row.submission_replies.length,
          last ? new Date(last.created_at).toISOString() : "",
          row.user_id ? "yes" : "no",
          row.message,
        ];
      }),
    );
    downloadCsv(`glassy-submissions-${stamp()}.csv`, csv);
    toast.success(`Exported ${filteredSubmissions.length} submissions.`);
  };

  const exportUsers = () => {
    if (filteredProfiles.length === 0) {
      toast.error("No users match these filters.");
      return;
    }
    const counts: Record<string, number> = {};
    for (const row of submissions ?? []) {
      if (row.user_id) counts[row.user_id] = (counts[row.user_id] ?? 0) + 1;
    }
    const csv = toCsv(
      ["Joined at", "Full name", "Email", "Briefs submitted"],
      filteredProfiles.map((profile) => [
        new Date(profile.created_at).toISOString(),
        profile.full_name ?? "",
        profile.email ?? "",
        counts[profile.id] ?? 0,
      ]),
    );
    downloadCsv(`glassy-users-${stamp()}.csv`, csv);
    toast.success(`Exported ${filteredProfiles.length} users.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-4xl border border-border bg-card p-6">
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          <Filter size={13} /> Filters
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
            From date
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
            To date
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={field} />
          </label>
        </div>
        <label className="mt-3 flex flex-col gap-1.5 text-xs font-semibold text-muted-foreground">
          Search name, email, brand, service or message
          <span className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. enzyme wash"
              className={cn(field, "pl-11")}
            />
          </span>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATUSES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold capitalize",
                status === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              {value.replace("_", " ")}
            </button>
          ))}
        </div>
        {(from || to || search || status !== "all") && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
              setSearch("");
              setStatus("all");
            }}
            className="mt-4 text-xs font-semibold text-primary underline"
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ExportCard
          title="Submissions"
          count={filteredSubmissions.length}
          total={submissions?.length ?? 0}
          loading={isLoading}
          note="Includes status, notification state, reply count and the full brief."
          onExport={exportSubmissions}
        />
        <ExportCard
          title="User data"
          count={filteredProfiles.length}
          total={profiles?.length ?? 0}
          loading={isLoading}
          note="Registered clients with join date and how many briefs they sent."
          onExport={exportUsers}
        />
      </div>

      <div className="overflow-hidden rounded-4xl border border-border bg-card">
        <p className="border-b border-border p-5 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Preview · first 8 matching submissions
        </p>
        {filteredSubmissions.slice(0, 8).map((row) => (
          <div key={row.id} className="border-b border-border p-5 last:border-b-0">
            <p className="truncate text-sm font-semibold">
              {row.name}
              {row.brand ? ` · ${row.brand}` : ""}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {row.service} · {row.status.replace("_", " ")} ·{" "}
              {new Date(row.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        {filteredSubmissions.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">Nothing matches these filters.</p>
        )}
      </div>
    </motion.div>
  );
}

function ExportCard({
  title,
  count,
  total,
  note,
  loading,
  onExport,
}: {
  title: string;
  count: number;
  total: number;
  note: string;
  loading: boolean;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col rounded-4xl border border-border bg-card p-6">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
      <p className="mt-4 font-display text-3xl font-extrabold">
        {loading ? "…" : count}
        <span className="ml-2 text-sm font-semibold text-muted-foreground">of {total}</span>
      </p>
      <button
        type="button"
        onClick={onExport}
        disabled={loading}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
      >
        <Download size={15} /> Download CSV
      </button>
    </div>
  );
}
