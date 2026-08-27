import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/templates")({
  component: AdminTemplates,
});

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  sort_order: number;
};

const field =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

function AdminTemplates() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<{ name: string; subject: string; body: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "email-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("id, name, subject, body, sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EmailTemplate[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "email-templates"] });

  const create = useMutation({
    mutationFn: async (input: { name: string; subject: string; body: string }) => {
      const { error } = await supabase
        .from("email_templates")
        .insert({ ...input, sort_order: (data?.length ?? 0) + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Template created.");
      setDraft(null);
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const update = useMutation({
    mutationFn: async (input: EmailTemplate) => {
      const { error } = await supabase
        .from("email_templates")
        .update({ name: input.name, subject: input.subject, body: input.body })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Template saved.");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("email_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Template deleted.");
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-4xl border border-border bg-surface-1 p-6">
        <p className="text-sm text-muted-foreground">
          Templates show up as one-tap presets in the submissions inbox. Use{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{"{{name}}"}</code>,{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{"{{service}}"}</code>,{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{"{{brand}}"}</code> and{" "}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{"{{email}}"}</code> — they
          get filled in from the brief before sending.
        </p>
        <button
          type="button"
          onClick={() => setDraft({ name: "", subject: "", body: "" })}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          <Plus size={15} /> New template
        </button>
      </div>

      <AnimatePresence>
        {draft && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.name.trim() || !draft.subject.trim() || !draft.body.trim()) {
                toast.error("Name, subject and body are all required.");
                return;
              }
              create.mutate({
                name: draft.name.trim(),
                subject: draft.subject.trim(),
                body: draft.body.trim(),
              });
            }}
            className="rounded-4xl border border-primary/40 bg-card p-6"
          >
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Template name"
              className={field}
            />
            <input
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              placeholder="Subject line"
              className={`${field} mt-3`}
            />
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={7}
              placeholder="Hi {{name}}, …"
              className={`${field} mt-3`}
            />
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={create.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {create.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save template
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading && <p className="text-sm text-muted-foreground">Loading templates…</p>}

      {(data ?? []).map((template, index) => (
        <TemplateCard
          key={template.id}
          template={template}
          index={index}
          saving={update.isPending}
          deleting={remove.isPending}
          onSave={(next) => update.mutate(next)}
          onDelete={() => remove.mutate(template.id)}
        />
      ))}

      {!isLoading && (data?.length ?? 0) === 0 && !draft && (
        <p className="rounded-4xl border border-border bg-surface-1 p-10 text-center text-sm text-muted-foreground">
          No templates yet.
        </p>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  index,
  saving,
  deleting,
  onSave,
  onDelete,
}: {
  template: EmailTemplate;
  index: number;
  saving: boolean;
  deleting: boolean;
  onSave: (next: EmailTemplate) => void;
  onDelete: () => void;
}) {
  const [local, setLocal] = useState(template);
  const dirty =
    local.name !== template.name ||
    local.subject !== template.subject ||
    local.body !== template.body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
      className="rounded-4xl border border-border bg-card p-6"
    >
      <input
        value={local.name}
        onChange={(e) => setLocal({ ...local, name: e.target.value })}
        className={field}
      />
      <input
        value={local.subject}
        onChange={(e) => setLocal({ ...local, subject: e.target.value })}
        className={`${field} mt-3`}
      />
      <textarea
        value={local.body}
        onChange={(e) => setLocal({ ...local, body: e.target.value })}
        rows={7}
        className={`${field} mt-3`}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!dirty || saving}
          onClick={() => onSave(local)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-5 py-3 text-sm font-semibold text-destructive disabled:opacity-50"
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </motion.div>
  );
}
