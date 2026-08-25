import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: AdminContent,
});

type Row = { key: string; value: Record<string, unknown>; updated_at: string };

const GROUPS: { key: string; title: string; hint: string; fields: [string, string][] }[] = [
  {
    key: "home.hero",
    title: "Homepage hero",
    hint: "The first thing visitors read.",
    fields: [
      ["eyebrow", "Eyebrow"],
      ["title", "Headline"],
      ["body", "Body copy"],
      ["primaryLabel", "Primary button"],
      ["secondaryLabel", "Secondary button"],
    ],
  },
  {
    key: "home.statement",
    title: "Homepage statement",
    hint: "The standard section.",
    fields: [
      ["eyebrow", "Eyebrow"],
      ["title", "Statement"],
    ],
  },
  {
    key: "home.cta",
    title: "Homepage closing CTA",
    hint: "Bottom-of-page invitation.",
    fields: [
      ["eyebrow", "Eyebrow"],
      ["title", "Headline"],
      ["copy", "Body copy"],
    ],
  },
  {
    key: "site.contact",
    title: "Contact & email settings",
    hint: "Where briefs are delivered and which address replies come from. Use a Resend-verified domain in the sender address to email clients directly.",
    fields: [
      ["phone", "Phone"],
      ["email", "Public email"],
      ["address", "Address"],
      ["notifyEmail", "Admin notification inbox"],
      ["fromName", "Sender name"],
      ["fromEmail", "Sender email (verified domain)"],
    ],
  },
];

function AdminContent() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});

  const { data } = useQuery({
    queryKey: ["admin", "site-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_content").select("key, value, updated_at");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  useEffect(() => {
    if (!data) return;
    const next: Record<string, Record<string, string>> = {};
    for (const row of data) {
      const fields: Record<string, string> = {};
      for (const [field, value] of Object.entries(row.value ?? {})) {
        if (typeof value === "string") fields[field] = value;
      }
      next[row.key] = fields;
    }
    setDraft(next);
  }, [data]);

  const save = useMutation({
    mutationFn: async (key: string) => {
      const existing = data?.find((row) => row.key === key)?.value ?? {};
      const merged = { ...existing, ...(draft[key] ?? {}) };
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: merged as never }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved — the site updates immediately.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "site-content"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((group, index) => (
        <motion.section
          key={group.key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.06, ease: [0.2, 0, 0, 1] }}
          className="rounded-4xl border border-border bg-card p-6 sm:p-8"
        >
          <h2 className="font-display text-xl font-bold">{group.title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{group.hint}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {group.fields.map(([field, label]) => {
              const value = draft[group.key]?.[field] ?? "";
              const long = field === "body" || field === "copy" || field === "address";
              return (
                <label key={field} className={long ? "sm:col-span-2" : ""}>
                  <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {label}
                  </span>
                  {long ? (
                    <textarea
                      rows={3}
                      value={value}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          [group.key]: { ...prev[group.key], [field]: event.target.value },
                        }))
                      }
                      className="w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  ) : (
                    <input
                      value={value}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          [group.key]: { ...prev[group.key], [field]: event.target.value },
                        }))
                      }
                      className="w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  )}
                </label>
              );
            })}
          </div>

          <button
            type="button"
            disabled={save.isPending}
            onClick={() => save.mutate(group.key)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save {group.title.toLowerCase()}
          </button>
        </motion.section>
      ))}
    </div>
  );
}
