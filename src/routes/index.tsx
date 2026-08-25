import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { M3Button } from "@/components/site-shell";
import { Marquee, Reveal, Scroll3D, SplitText, TiltCard } from "@/components/motion-primitives";
import { process, specialties, stats, washes } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/site-content.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glassy Washing Plant — Professional Garment Washing, Dhaka" },
      {
        name: "description",
        content:
          "Washing, dyeing, dry process and finishing for fashion brands and garment manufacturers. 11,500 sq ft, 120+ operators, 650K pieces a month.",
      },
      { property: "og:title", content: "Glassy Washing Plant — Professional Garment Washing" },
      {
        property: "og:description",
        content: "Garment washing, dyeing and finishing built for quality at commercial scale.",
      },
    ],
  }),
  loader: () => getSiteContent(),
  component: Home,
});

function Home() {
  const content = Route.useLoaderData();
  const [selected, setSelected] = useState(0);
  const current = washes[selected] ?? washes[0]!;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
          <img
            src="/images/facility-wide.jpg"
            alt="Operators working across the Glassy washing plant floor"
            className="size-full scale-110 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/80 to-background" />
        </motion.div>

        <motion.div
          style={{ opacity: fade }}
          className="container-site flex min-h-[86vh] flex-col justify-center py-24"
        >
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="eyebrow"
          >
            {pick(content, "home.hero", "eyebrow", "Cleaner fabrics. Better business.")}
          </motion.p>

          <SplitText
            as="h1"
            text={pick(content, "home.hero", "title", "Professional garment washing solutions")}
            delay={0.15}
            className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.94] font-extrabold"
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            {pick(
              content,
              "home.hero",
              "body",
              "Glassy Washing Plant provides washing, drying, dyeing and transport for fashion brands, garment manufacturers and textile companies across Bangladesh.",
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64, duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <M3Button to="/services">
              {pick(content, "home.hero", "primaryLabel", "Explore our services")}{" "}
              <ArrowRight size={16} />
            </M3Button>
            <M3Button to="/contact" variant="outlined">
              Request a quote <ArrowRight size={16} />
            </M3Button>
          </motion.div>
        </motion.div>
      </section>

      <Marquee items={specialties} />

      {/* Stats */}
      <section className="container-site py-24">
        <p className="eyebrow">A wash house with real capacity</p>
        <SplitText
          text="Built for quality at commercial scale."
          className="mt-4 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label], i) => (
            <Reveal key={label} delay={i} from={i % 2 ? "up" : "down"} tilt>
              <TiltCard className="m3-card h-full p-7">
                <span className="block font-display text-4xl font-extrabold text-primary">
                  {value}
                </span>
                <span className="mt-3 block text-sm text-muted-foreground">{label}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Wash selector */}
      <section className="bg-surface-1 py-24">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Reveal from="left">
              <p className="eyebrow">01 / What we do</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
                The right finish
                <br />
                changes everything.
              </h2>
            </Reveal>
            <Reveal from="right">
              <p className="text-base leading-relaxed text-muted-foreground">
                From first swatch to final handover, our Dhaka team manages the wash details that
                make a garment feel considered — and keep a production line moving.
              </p>
            </Reveal>
          </div>

          <Scroll3D className="mt-14" intensity={0.8}>
          <div className="perspective-scene grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-2" role="tablist" aria-label="Wash families">
              {washes.map((wash, i) => (
                <button
                  key={wash.id}
                  role="tab"
                  aria-selected={selected === i}
                  onClick={() => setSelected(i)}
                  className={`state-layer relative flex items-center gap-4 rounded-2xl px-5 py-5 text-left transition-colors duration-300 ${
                    selected === i ? "text-on-primary-container" : "text-foreground"
                  }`}
                >
                  {selected === i && (
                    <motion.span
                      layoutId="wash-pill"
                      className="absolute inset-0 -z-10 rounded-2xl bg-primary-container"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="font-mono text-xs opacity-60">{wash.id}</span>
                  <h3 className="flex-1 font-display text-lg font-bold">{wash.title}</h3>
                  <ChevronRight size={18} className="opacity-50" />
                </button>
              ))}
            </div>

            <motion.div
              key={selected}
              initial={{ opacity: 0, rotateY: 10, x: 40 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-elev-2"
            >
              <img
                src={current.image}
                alt={`${current.title} process at Glassy`}
                className="h-64 w-full object-cover sm:h-80"
              />
              <div className="p-7">
                <h3 className="font-display text-2xl font-bold">{current.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {current.copy}
                </p>
              </div>
            </motion.div>
          </div>
          </Scroll3D>
        </div>
      </section>

      {/* Statement */}
      <section className="container-site py-28 text-center">
        <p className="eyebrow">
          {pick(content, "home.statement", "eyebrow", "02 / The Glassy standard")}
        </p>
        <SplitText
          text={pick(
            content,
            "home.statement",
            "title",
            "A better wash is measured in the details you can feel.",
          )}
          className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.2rem,5.6vw,4.6rem)] leading-[0.98] font-extrabold text-on-primary-container"
        />
      </section>

      {/* Gallery strip */}
      <section className="container-site pb-24">
        <Scroll3D>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/images/wash-stone.jpg", "Stone wash"],
            ["/images/wash-dye.jpg", "Colour work"],
            ["/images/wash-handwork.jpg", "Handwork"],
            ["/images/swatches.jpg", "Shade approval"],
          ].map(([src, label], i) => (
            <Reveal key={label} delay={i} from={i % 2 ? "right" : "left"} tilt>
              <figure className="group relative overflow-hidden rounded-3xl border border-border shadow-elev-1">
                <img
                  src={src}
                  alt={label}
                  loading="lazy"
                  className="h-64 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-inverse-surface/85 to-transparent p-5 font-display text-lg font-bold text-inverse-foreground">
                  {label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        </Scroll3D>
      </section>

      {/* Process */}
      <section className="bg-surface-1 py-24">
        <div className="container-site">
          <p className="eyebrow">03 / Our process</p>
          <SplitText
            text="From reference to repeatable."
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold"
          />
          <Scroll3D className="mt-14" intensity={0.9}>
          <div className="perspective-scene grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map(([step, title, copy], i) => (
              <Reveal key={step} delay={i} from="up" tilt>
                <div className="m3-card h-full p-7">
                  <span className="font-mono text-xs tracking-widest text-primary">{step}</span>
                  <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
          </Scroll3D>
        </div>
      </section>

      {/* CTA */}
      <CtaPanel
        eyebrow={pick(content, "home.cta", "eyebrow", "Ready to get started?")}
        title={pick(content, "home.cta", "title", "Bring us the reference.")}
        copy={pick(
          content,
          "home.cta",
          "copy",
          "Tell us what you are making, where it needs to go, and how it should feel. We will take it from there.",
        )}
      />
    </>
  );
}

export function CtaPanel({
  eyebrow = "Ready to get started?",
  title = "Bring us the reference.",
  copy = "Tell us what you are making, where it needs to go, and how it should feel. We will take it from there.",
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
}) {
  return (
    <section className="container-site py-24">
      <Scroll3D intensity={0.7}>
        <div className="grid gap-8 rounded-4xl bg-inverse-surface p-10 text-inverse-foreground md:grid-cols-2 md:p-16">
          <div>
            <p className="eyebrow text-inverse-foreground/60">{eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
              {title}
            </h2>
          </div>
          <div className="flex flex-col items-start justify-end gap-6">
            <p className="text-sm leading-relaxed text-inverse-foreground/75">{copy}</p>
            <Link
              to="/contact"
              className="state-layer inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container"
            >
              Start a conversation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Scroll3D>
    </section>
  );
}
