import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
};

function AdminUsers() {
  const { data: profiles, isLoading } = useQuery({
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

  const { data: roles } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return (data ?? []) as { user_id: string; role: string }[];
    },
  });

  const { data: counts } = useQuery({
    queryKey: ["admin", "submission-owners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("user_id");
      if (error) throw error;
      const map: Record<string, number> = {};
      for (const row of data ?? []) {
        if (row.user_id) map[row.user_id] = (map[row.user_id] ?? 0) + 1;
      }
      return map;
    },
  });

  return (
    <div className="overflow-hidden rounded-4xl border border-border bg-card">
      {isLoading && <p className="p-8 text-sm text-muted-foreground">Loading users…</p>}
      {!isLoading && (profiles?.length ?? 0) === 0 && (
        <p className="p-8 text-sm text-muted-foreground">No registered users yet.</p>
      )}
      {profiles?.map((profile, index) => {
        const isAdmin = (roles ?? []).some(
          (role) => role.user_id === profile.id && role.role === "admin",
        );
        return (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold">
                {profile.full_name || "Unnamed client"}
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wide text-on-primary-container uppercase">
                    <ShieldCheck size={11} /> Admin
                  </span>
                )}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {profile.email} · joined {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {counts?.[profile.id] ?? 0} brief{(counts?.[profile.id] ?? 0) === 1 ? "" : "s"}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
