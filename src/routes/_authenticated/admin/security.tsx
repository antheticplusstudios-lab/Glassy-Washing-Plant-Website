import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { KeyRound, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/admin/security")({
  component: AdminSecurity,
});

const GATE_PASSPHRASE = "adminpass29@";

function AdminSecurity() {
  const { user } = useAuth();
  const [gate, setGate] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "password" | null>(null);

  async function changeEmail() {
    if (!email.trim()) return;
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEmail("");
    toast.success("Admin email updated.");
  }

  async function changePassword() {
    if (password.length < 8) {
      toast.error("Use at least 8 characters.");
      return;
    }
    setBusy("password");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    toast.success("Admin password updated.");
  }

  if (!unlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        className="mx-auto max-w-md rounded-4xl border border-border bg-card p-8 text-center"
      >
        <ShieldCheck className="mx-auto text-primary" />
        <h2 className="mt-4 font-display text-2xl font-extrabold">Confirm it's you</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the admin security passphrase to unlock email and password changes.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (gate === GATE_PASSPHRASE) {
              setUnlocked(true);
              setGate("");
              toast.success("Unlocked.");
            } else {
              toast.error("Wrong passphrase.");
            }
          }}
          className="mt-6 flex flex-col gap-3"
        >
          <span className="relative flex items-center">
            <Lock size={16} className="absolute left-4 text-muted-foreground" />
            <input
              type="password"
              value={gate}
              onChange={(event) => setGate(event.target.value)}
              placeholder="Security passphrase"
              className="w-full rounded-2xl border border-border bg-surface-1 py-3.5 pr-4 pl-11 text-sm outline-none focus:border-primary"
            />
          </span>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Unlock
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-4xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <Mail size={17} /> Change admin email
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Current: <strong>{user?.email}</strong>
        </p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="new@email.com"
          className="mt-5 w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => void changeEmail()}
          disabled={busy === "email"}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy === "email" && <Loader2 size={15} className="animate-spin" />} Update email
        </button>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.06 }}
        className="rounded-4xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="flex items-center gap-2 font-display text-xl font-bold">
          <KeyRound size={17} /> Reset admin password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sets a new password for the signed-in admin account immediately.
        </p>
        <input
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="New password"
          className="mt-5 w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => void changePassword()}
          disabled={busy === "password"}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy === "password" && <Loader2 size={15} className="animate-spin" />} Update password
        </button>
      </motion.section>
    </div>
  );
}
