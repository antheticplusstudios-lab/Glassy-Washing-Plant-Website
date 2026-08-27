"use client";

import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { company, legalLinks, navItems } from "@/lib/site-data";
import { MotionToggle } from "@/components/motion-toggle";
import { cn } from "@/lib/utils";

export function M3Button({
  to,
  href,
  variant = "filled",
  children,
  className,
  external,
}: {
  to?: string;
  href?: string;
  variant?: "filled" | "tonal" | "outlined" | "text";
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const base = cn(
    "state-layer inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.97]",
    variant === "filled" && "bg-primary text-primary-foreground shadow-elev-1 hover:shadow-elev-2",
    variant === "tonal" && "bg-primary-container text-on-primary-container hover:shadow-elev-1",
    variant === "outlined" && "border border-outline text-foreground hover:bg-surface-2",
    variant === "text" && "px-3 text-primary",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={base}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={base}>
      {children}
    </Link>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();

    // When already on the homepage, keep the route in place and smoothly
    // return to the hero instead of triggering a fresh route navigation.
    if (pathname === "/") {
      event.preventDefault();
      document.getElementById("home-hero")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <Link to="/" onClick={handleClick} className="group flex items-center gap-3" aria-label="Glassy Washing Plant home">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/70 transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] group-hover:rotate-[-8deg]">
        <img
          src="/logo-mark.png"
          alt="Glassy Washing Plant"
          width={40}
          height={40}
          className="size-full object-contain p-0.5"
          decoding="async"
        />
      </span>
      <span className="flex flex-col leading-none">
        <strong className="font-display text-base font-extrabold tracking-tight">GLASSY</strong>
        <small className="font-mono text-[0.58rem] tracking-[0.22em] text-muted-foreground">
          WASHING PLANT
        </small>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const next = window.scrollY > 12;
      setScrolled((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]",
          scrolled ? "bg-background/95 shadow-elev-1" : "bg-transparent",
        )}
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-4">
          <Brand />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "state-layer relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    active ? "text-on-primary-container" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary-container"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <MotionToggle />
            </span>
            <M3Button to="/contact" className="hidden md:inline-flex">
              Request a quote <ArrowRight size={15} />
            </M3Button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              className="state-layer grid size-11 place-items-center rounded-full border border-border bg-surface-1 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                  className="grid place-items-center"
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-sheet"
            className="fixed inset-0 z-40 lg:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.div
              className="absolute inset-0 bg-foreground/40"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              aria-label="Mobile navigation"
              className="absolute inset-x-3 top-[80px] origin-top rounded-3xl border border-border bg-card p-4 shadow-elev-3"
              variants={{
                hidden: { opacity: 0, y: -24, scaleY: 0.9 },
                show: { opacity: 1, y: 0, scaleY: 1 },
              }}
              transition={{ duration: 0.42, ease: [0.2, 0, 0, 1] }}
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "state-layer flex items-center justify-between rounded-2xl px-4 py-4 font-display text-lg font-semibold",
                      pathname === item.to
                        ? "bg-primary-container text-on-primary-container"
                        : "text-foreground",
                    )}
                  >
                    {item.label}
                    <ArrowRight size={16} className="opacity-50" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-2 px-1"
              >
                <M3Button to="/contact" className="w-full justify-center">
                  Request a quote <ArrowRight size={15} />
                </M3Button>
                <MotionToggle compact />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Professional garment washing and finishing from Vatara, Dhaka — precise enough for the
            sample, ready for the shipment.
          </p>
        </div>
        <div>
          <p className="eyebrow">Navigate</p>
          <div className="mt-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {legalLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Direct line</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <a href={company.phoneHref} className="w-fit transition-colors hover:text-primary">
              {company.phone}
            </a>
            <a href={company.emailHref} className="w-fit transition-colors hover:text-primary">
              {company.email}
            </a>
            <address className="not-italic leading-relaxed">{company.address}</address>
          </div>
        </div>
      </div>
      <div className="container-site flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">
        <span>© {new Date().getFullYear()} Glassy Washing Plant</span>
        <span>Dhaka · Bangladesh</span>
        <span>Developed by NexGrowth Solutions</span>
      </div>
    </footer>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  // Keep route changes paint-first: no artificial fade/transform on the whole
  // page. This avoids blank frames and temporary horizontal gutters on mobile.
  return <main className="w-full min-w-0 pt-[72px]">{children}</main>;
}
