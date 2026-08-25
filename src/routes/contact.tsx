import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Reveal, SplitText } from "@/components/motion-primitives";
import { M3Button } from "@/components/site-shell";
import { company, faqs } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { SERVICE_OPTIONS, contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { checkContactRateLimit, recordContactSubmission } from "@/lib/contact-rate-limit";
import { submitContactBrief, submitContactBriefAsUser } from "@/lib/contact.functions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Quote Request | Glassy Washing Plant, Dhaka" },
      {
        name: "description",
        content:
          "Send Glassy Washing Plant your next garment wash brief. Call, WhatsApp or email the Vatara, Dhaka team and get a clear next step.",
      },
      { property: "og:title", content: "Request a Quote — Glassy Washing Plant" },
      {
        property: "og:description",
        content:
          "A reference photo, a sample garment or a half-formed idea is enough. We reply with the right next step.",
      },
    ],
  }),
  component: Contact,
});

type Step = "form" | "review" | "sent";

/** Bots that submit instantly (no JS delay) trip this; real visitors don't. */
const MIN_SUBMIT_MS = 3000;

function randomMathChallenge() {
  return {
    a: Math.floor(Math.random() * 8) + 2, // 2–9
    b: Math.floor(Math.random() * 8) + 2, // 2–9
  };
}

function Contact() {
  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const mountedAt = useRef(Date.now());
  const [math, setMath] = useState(randomMathChallenge);
  const [mathInput, setMathInput] = useState("");
  const [mathError, setMathError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: { name: "", email: "", brand: "", service: undefined as unknown as ContactFormValues["service"], message: "" },
  });

  const fieldClass =
    "mt-2 w-full rounded-2xl border border-border bg-surface-1 px-4 py-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25";
  const errorFieldClass = "border-destructive focus:border-destructive focus:ring-destructive/25";

  function resetSpamChecks() {
    mountedAt.current = Date.now();
    setMath(randomMathChallenge());
    setMathInput("");
    setMathError(null);
    if (honeypotRef.current) honeypotRef.current.value = "";
  }

  function goToReview() {
    setMathError(null);

    if (honeypotRef.current?.value) {
      // Bot filled the hidden field — reject quietly, no toast.
      return;
    }

    if (Date.now() - mountedAt.current < MIN_SUBMIT_MS) {
      toast.error("That was fast — please take a moment and try again.");
      return;
    }

    if (Number(mathInput) !== math.a + math.b) {
      setMathError("That doesn't add up — try again.");
      return;
    }

    const rateLimit = checkContactRateLimit();
    if (!rateLimit.allowed) {
      toast.error(rateLimit.reason);
      return;
    }

    setStep("review");
  }

  async function confirmAndSend() {
    setSubmitting(true);
    try {
      const submit = session ? submitContactBriefAsUser : submitContactBrief;
      await submit({
        data: {
          ...getValues(),
          honeypot: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - mountedAt.current,
          mathA: math.a,
          mathB: math.b,
          mathAnswer: Number(mathInput),
        },
      });
      recordContactSubmission();
      setStep("sent");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function sendAnother() {
    reset();
    resetSpamChecks();
    setStep("form");
  }

  const values = getValues();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-2 to-background" />
        <div className="container-site py-24 md:py-32">
          <Reveal from="down">
            <p className="eyebrow">05 / Start a conversation</p>
          </Reveal>
          <SplitText
            as="h1"
            text="Tell us how it should feel."
            className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6.6vw,5rem)] leading-[0.94] font-extrabold tracking-tight"
          />
          <Reveal from="up" delay={2}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A reference photo, a sample garment or a half-formed idea is enough. We will reply with
              the right next step.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact + form */}
      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal from="left">
          <p className="eyebrow">The direct line</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.02] font-extrabold">
            Let&apos;s make
            <br />
            something real.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            If it needs a wash, dye, hand or a second opinion, start here. Our team replies with a
            clear next step — not a brochure.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={company.phoneHref}
              className="m3-card state-layer flex items-center justify-between p-5 text-sm font-semibold"
            >
              {company.phone}
              <ArrowRight size={15} className="text-primary" />
            </a>
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="m3-card state-layer flex items-center justify-between p-5 text-sm font-semibold"
            >
              WhatsApp the wash house
              <ArrowRight size={15} className="text-primary" />
            </a>
            <a
              href={company.emailHref}
              className="m3-card state-layer flex items-center justify-between p-5 text-sm font-semibold"
            >
              {company.email}
              <ArrowRight size={15} className="text-primary" />
            </a>
            <address className="m3-card p-5 text-sm leading-relaxed text-muted-foreground not-italic">
              {company.address}
            </address>
          </div>
        </Reveal>

        <Reveal from="right" tilt>
          <div className="m3-card p-7 md:p-9">
            <AnimatePresence mode="wait" initial={false}>
              {step === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
                  role="status"
                  className="py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16 }}
                    className="mx-auto grid size-14 place-items-center rounded-full bg-primary-container text-on-primary-container"
                  >
                    <CircleCheck size={24} />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold">Brief received.</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Thanks — the Glassy team will be in touch shortly. Bring the garment when you
                    visit.
                  </p>
                  <div className="mt-7 flex justify-center gap-3">
                    <M3Button to="/" variant="outlined">
                      Back to home <ArrowRight size={15} />
                    </M3Button>
                    <button
                      type="button"
                      onClick={sendAnother}
                      className="state-layer rounded-full px-4 py-3 text-sm font-semibold text-primary"
                    >
                      Send another
                    </button>
                  </div>
                </motion.div>
              ) : step === "review" ? (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                >
                  <p className="eyebrow">Review your brief</p>
                  <h3 className="mt-3 font-display text-xl font-extrabold">
                    Look right before it sends?
                  </h3>
                  <dl className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface-1 p-5">
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Service
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">{values.service}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">{values.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm font-semibold">{values.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Message
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {values.message}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      disabled={submitting}
                      className="state-layer rounded-full px-4 py-3 text-sm font-semibold text-primary disabled:opacity-50"
                    >
                      Edit brief
                    </button>
                    <button
                      type="button"
                      onClick={confirmAndSend}
                      disabled={submitting}
                      className="state-layer inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elev-1 transition-all duration-300 hover:shadow-elev-2 active:scale-[0.97] disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : "Confirm & send"}
                      {!submitting && <ArrowRight size={16} />}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(goToReview)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                  noValidate
                >
                  <p className="eyebrow">Your brief</p>

                  {/* Honeypot — hidden from sighted and screen-reader users alike. */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="company_website">Leave this field empty</label>
                    <input
                      ref={honeypotRef}
                      id="company_website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="text-xs font-semibold tracking-wide">
                        Name
                      </label>
                      <input
                        id="name"
                        placeholder="Your name"
                        className={cn(fieldClass, errors.name && errorFieldClass)}
                        aria-invalid={errors.name ? "true" : "false"}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p id="name-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="text-xs font-semibold tracking-wide">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@brand.com"
                        className={cn(fieldClass, errors.email && errorFieldClass)}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p id="email-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="brand" className="text-xs font-semibold tracking-wide">
                      Brand or company
                    </label>
                    <input
                      id="brand"
                      placeholder="Who are we working with?"
                      className={cn(fieldClass, errors.brand && errorFieldClass)}
                      aria-invalid={errors.brand ? "true" : "false"}
                      aria-describedby={errors.brand ? "brand-error" : undefined}
                      {...register("brand")}
                    />
                    {errors.brand && (
                      <p id="brand-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="service" className="text-xs font-semibold tracking-wide">
                      What do you need?
                    </label>
                    <select
                      id="service"
                      defaultValue=""
                      className={cn(fieldClass, errors.service && errorFieldClass)}
                      aria-invalid={errors.service ? "true" : "false"}
                      aria-describedby={errors.service ? "service-error" : undefined}
                      {...register("service")}
                    >
                      <option value="" disabled>
                        Select a starting point
                      </option>
                      {SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p id="service-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                        {errors.service.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="message" className="text-xs font-semibold tracking-wide">
                      Tell us about the wash
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="What are you making, and when do you need it?"
                      className={cn(fieldClass, errors.message && errorFieldClass)}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p id="message-error" role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="mt-5">
                    <label htmlFor="math-check" className="text-xs font-semibold tracking-wide">
                      Quick check: what is {math.a} + {math.b}?
                    </label>
                    <input
                      id="math-check"
                      inputMode="numeric"
                      placeholder="Your answer"
                      value={mathInput}
                      onChange={(event) => setMathInput(event.target.value)}
                      className={cn(fieldClass, mathError && errorFieldClass)}
                      aria-invalid={mathError ? "true" : "false"}
                      aria-describedby={mathError ? "math-check-error" : undefined}
                    />
                    {mathError && (
                      <p
                        id="math-check-error"
                        role="alert"
                        className="mt-1.5 text-xs font-medium text-destructive"
                      >
                        {mathError}
                      </p>
                    )}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-[16rem] text-xs text-muted-foreground">
                      We only use your details to reply to this enquiry.
                    </p>
                    <button
                      type="submit"
                      className="state-layer inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elev-1 transition-all duration-300 hover:shadow-elev-2 active:scale-[0.97]"
                    >
                      Send the brief <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-surface-1 py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal from="left">
            <p className="eyebrow">Useful before you send</p>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-[1] font-extrabold">
              Good questions
              <br />
              make better finishes.
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {faqs.map(([question, answer], i) => (
              <Reveal key={question} delay={i} from="right">
                <FaqItem question={question} answer={answer} defaultOpen={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="m3-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="state-layer flex w-full items-center justify-between gap-4 p-6 text-left font-display text-base font-bold"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container"
        >
          {open ? <Minus size={15} /> : <Plus size={15} />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.2, 0, 0, 1] }}
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
