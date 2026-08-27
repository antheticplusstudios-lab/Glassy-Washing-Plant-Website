import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Client access — Glassy Washing Plant" },
      { name: "robots", content: "noindex,nofollow,noarchive" },
      {
        name: "description",
        content:
          "Sign in or create a Glassy Washing Plant account to track your wash briefs and replies from our Dhaka team.",
      },
      { property: "og:title", content: "Client access — Glassy Washing Plant" },
      {
        property: "og:description",
        content: "Sign in to follow your wash briefs and our replies.",
      },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  fullName: z.string().trim().max(120).optional(),
  email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type Mode = "signin" | "signup";

function AuthPage() {
  const search = Route.useSearch();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    setMode(search.mode ?? "signin");
  }, [search.mode]);

  useEffect(() => {
    if (!loading && session) {
      void navigate({ to: isAdmin ? "/admin" : "/profile", replace: true });
    }
  }, [loading, session, isAdmin, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = credentialsSchema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = next[key] ?? issue.message;
      }
      setErrors(next);
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: parsed.data.fullName ?? "" },
          },
        });
        if (error) throw error;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (signInError) throw signInError;
        toast.success("Account created — welcome in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Signed in.");
      }
      await router.invalidate();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        aria-hidden
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        className="absolute inset-0 -z-10"
      >
        <img src="/images/swatches.jpg" alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/88 to-background" />
      </motion.div>

      <div className="container-site flex items-center justify-center py-10 sm:py-14">
        <motion.div
          layout
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
          className="w-full max-w-md rounded-4xl border border-border bg-card/95 p-8 shadow-elev-3 backdrop-blur-xl sm:p-10"
        >
          <p className="eyebrow">Client access</p>

          <div className="mt-4 flex items-center gap-1 rounded-full bg-surface-2 p-1">
            {(["signin", "signup"] as Mode[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setErrors({});
                }}
                className={cn(
                  "relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  mode === value ? "text-on-primary-container" : "text-muted-foreground",
                )}
              >
                {mode === value && (
                  <motion.span
                    layoutId="auth-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary-container"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {value === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {(
              <motion.form
                key={mode}
                onSubmit={onSubmit}
                initial={{ opacity: 0, x: mode === "signin" ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signin" ? 24 : -24 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="mt-8 flex flex-col gap-4"
              >
                <h1 className="font-display text-3xl leading-[1.05] font-extrabold">
                  {mode === "signin" ? "Welcome back." : "Start your file."}
                </h1>
                <p className="-mt-1 text-sm leading-relaxed text-muted-foreground">
                  {mode === "signin"
                    ? "Sign in to follow your briefs and read our replies."
                    : "Create an account so every brief and reply stays in one place."}
                </p>

                <AnimatePresence initial={false}>
                  {mode === "signup" && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                      className="overflow-hidden"
                    >
                      <Field
                        icon={<UserIcon size={16} />}
                        label="Full name"
                        value={fullName}
                        onChange={setFullName}
                        autoComplete="name"
                        error={errors["fullName"]}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field
                  icon={<Mail size={16} />}
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  error={errors["email"]}
                />
                <Field
                  icon={<Lock size={16} />}
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  error={errors["password"]}
                />

                <motion.button
                  type="submit"
                  disabled={busy}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-elev-1 disabled:opacity-60"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  {mode === "signin" ? "Sign in" : "Create account"}
                  {!busy && <ArrowRight size={16} />}
                </motion.button>

                <p className="text-center text-xs text-muted-foreground">
                  By continuing you agree that we may contact you about your brief.{" "}
                  <Link to="/contact" className="text-primary">
                    Prefer the form?
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="relative flex items-center">
        <span className="absolute left-4 text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "w-full rounded-2xl border bg-surface-1 py-3.5 pr-4 pl-11 text-sm outline-none transition-colors focus:border-primary",
            error ? "border-destructive" : "border-border",
          )}
        />
      </span>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
