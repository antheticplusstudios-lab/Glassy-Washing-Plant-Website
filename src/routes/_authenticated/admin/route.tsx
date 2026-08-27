import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BarChart3,
  Download,
  FileText,
  Inbox,
  MailPlus,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/content", label: "Site content", icon: FileText },
  { to: "/admin/templates", label: "Templates", icon: MailPlus },
  { to: "/admin/export", label: "Export", icon: Download },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/security", label: "Security", icon: ShieldCheck },
] as const;

function AdminLayout() {
  const { isAdmin, loading, user } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (loading) {
    return (
      <div className="container-site py-32 text-center text-sm text-muted-foreground">
        Checking your access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-site py-32 text-center">
        <p className="eyebrow">Restricted</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Admins only</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          The account {user?.email} doesn't have admin access. If this is unexpected, contact the
          plant office.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Go to your briefs
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        <p className="eyebrow">Control room</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl">
          Admin panel
        </h1>
      </motion.div>

      <nav className="mt-8 flex gap-1.5 overflow-x-auto rounded-full border border-border bg-surface-1 p-1.5">
        {links.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                active ? "text-on-primary-container" : "text-muted-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary-container"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <link.icon size={15} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  );
}
