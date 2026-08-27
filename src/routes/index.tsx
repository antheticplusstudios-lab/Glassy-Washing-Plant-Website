import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { M3Button } from "@/components/site-shell";
import { Marquee, Reveal, Scroll3D, SplitText, TiltCard } from "@/components/motion-primitives";
import { ServiceCoverflow } from "@/components/service-coverflow";
import { allServices, process, specialties, stats } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/site-content.functions";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garment Washing Plant in Bangladesh | Glassy Washing Plant" },
      {
        name: "description",
        content:
          "Garment washing plant in Bangladesh serving Dhaka and apparel manufacturers with garment washing, denim washing, dyeing and finishing services.",
      },
      { property: "og:title", content: "Garment Washing Plant in Bangladesh | Glassy Washing Plant" },
      {
        property: "og:description",
        content: "Garment washing, denim washing, dyeing and finishing services in Dhaka, Bangladesh for apparel brands and manufacturers.",
      },
    ],
    links: seoLinks("/"),
  }),
  loader: () => getSiteContent(),
  // Site copy changes infrequently; keep it cached during client navigation
  // so returning home does not wait for Supabase again.
  staleTime: 60_000,
  component: Home,
});

function Home() {
  const content = Route.useLoaderData();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  return (
    <>
      {/* Hero */}
      <section id="home-hero" ref={heroRef} className="relative scroll-mt-[72px] overflow-hidden">
        <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10">
          <img
            src="/images/facility-wide.jpg"
            alt="Operators working across the Glassy washing plant floor"
            className="size-full scale-105 object-cover" decoding="async" fetchPriority="high"
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

      {/* Search-intent / service positioning */}
      <section className="container-site py-20 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal from="left">
            <p className="eyebrow">Garment washing in Bangladesh</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
              A garment washing plant in Dhaka for production-ready finishes.
            </h2>
          </Reveal>
          <Reveal from="right">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Glassy Washing Plant provides garment washing services in Bangladesh, with a production
                floor in Vatara, Dhaka. Our work covers denim and apparel washing, garment dyeing,
                dry-process effects and finishing for brands, manufacturers and sourcing teams.
              </p>
              <p>
                Core capabilities include enzyme wash, stone wash, bleach wash, acid wash, pigment
                wash, overdye, softener and silicon finishing, whiskering, grinding, scrapping,
                PP spray and hand brush work. Send an approved reference or wash standard so the
                team can assess the right process for your garment.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Garment washing plant Bangladesh",
                  "Garment washing plant Dhaka",
                  "Denim washing service Bangladesh",
                  "Garment dyeing service Bangladesh",
                  "Garment finishing services Bangladesh",
                  "Garment wet processing Bangladesh",
                ].map((keyword) => (
                  <span key={keyword} className="rounded-full bg-surface-2 px-3 py-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
                Twenty-two wash, dye and dry-process specialties, refined batch after batch on our
                own floor. Click a card, swipe, or let it play — every finish we run is right here.
              </p>
            </Reveal>
          </div>

          <Scroll3D className="mt-14" intensity={0.6}>
            <ServiceCoverflow items={allServices} />
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
