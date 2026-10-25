import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, SplitText, TiltCard, Marquee } from "@/components/motion-primitives";
import { M3Button } from "@/components/site-shell";
import { company, facility, machinery, mission, specialties, vision } from "@/lib/site-data";
import { CtaPanel } from "./index";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Garment Washing Factory in Dhaka, Bangladesh | Glassy" },
      {
        name: "description",
        content:
          "Glassy Washing Plant is a garment washing factory in Dhaka, Bangladesh, providing washing, dyeing, dry-process and finishing services for apparel manufacturers.",
      },
      { property: "og:title", content: "The Factory — Glassy Washing Plant" },
      {
        property: "og:description",
        content:
          "A connected wash floor in Vatara, Dhaka where operators, technicians and QC work in the same rhythm.",
      },
    ],
    links: seoLinks("/about"),
  }),
  component: About,
});

const facts: [string, string][] = [
  ["11,500", "sq ft factory"],
  ["120+", "workers"],
  ["$2.5M+", "last-year volume"],
];

const timeline: [string, string, string][] = [
  ["01", "Brief", "References become a shared language between brand, lab and production."],
  ["02", "Prove", "We test shade, hand-feel and placement before a bulk garment is touched."],
  ["03", "Repeat", "Documented recipes hold the line, even when the order gets bigger."],
];

const capacity: [string, string][] = [
  ["250K", "Denim pieces / month"],
  ["400K", "Twill pieces / month"],
  ["Dhaka", "Vatara production floor"],
];

function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface-2 to-background" />
        <div className="container-site py-24 md:py-32">
          <Reveal from="down">
            <p className="eyebrow">The factory / Vatara, Dhaka</p>
          </Reveal>
          <SplitText
            as="h1"
            text="The detail lives here."
            className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6.6vw,5rem)] leading-[0.94] font-extrabold tracking-tight"
          />
          <Reveal from="up" delay={2}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A connected wash floor where operators, technicians and QC work in the same rhythm —
              so the finish survives the jump from sample to shipment.
            </p>
          </Reveal>
          <Reveal from="up" delay={3} className="mt-9 flex flex-wrap gap-3">
            <M3Button to="/services">
              See the wash library <ArrowRight size={15} />
            </M3Button>
            <M3Button to="/contact" variant="outlined">
              Visit the floor <ArrowRight size={15} />
            </M3Button>
          </Reveal>
        </div>
      </section>

      {/* Story + timeline */}
      <section className="container-site py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <Reveal from="left">
            <p className="eyebrow">A floor you can trust</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
              Closer to the work.
              <br />
              Closer to you.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Glassy Washing Plant is built around a straightforward belief: a washing plant should
              feel like part of your team. That means one accountable point of contact, decisions
              made on the floor, and a recipe that gets better every time it runs.
            </p>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {facts.map(([value, label], i) => (
                <Reveal key={label} delay={i} from="up">
                  <div className="m3-card p-5">
                    <strong className="block font-display text-2xl font-extrabold text-primary">
                      {value}
                    </strong>
                    <span className="mt-1 block text-xs text-muted-foreground">{label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <div className="perspective-scene flex flex-col gap-4">
            {timeline.map(([step, title, copy], i) => (
              <Reveal key={step} delay={i} from="right" tilt>
                <TiltCard className="m3-card flex gap-5 p-6">
                  <span className="font-mono text-xs text-primary">{step}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal from="up" tilt className="mt-16">
          <img
            src="/images/v2/facility-wide.jpg"
            alt="Operators working across the Glassy Washing Plant floor, between washing machines and garment trolleys"
            loading="lazy"
            decoding="async"
            className="aspect-[16/9] w-full rounded-4xl border border-border object-cover shadow-elev-2"
          />
        </Reveal>
      </section>

      <Marquee items={specialties} />

      {/* Capacity */}
      <section className="bg-surface-1 py-24">
        <div className="container-site">
          <Reveal from="left">
            <p className="eyebrow">At a glance</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] font-extrabold">
              Capacity that makes
              <br />
              ambitious briefs possible.
            </h2>
          </Reveal>
          <div className="perspective-scene mt-12 grid gap-4 sm:grid-cols-3">
            {capacity.map(([value, label], i) => (
              <Reveal key={label} delay={i} from={i % 2 ? "down" : "up"} tilt>
                <TiltCard className="m3-card h-full p-8">
                  <span className="font-display text-[clamp(2rem,4vw,2.8rem)] font-extrabold text-primary">
                    {value}
                  </span>
                  <p className="mt-2 text-sm text-muted-foreground">{label}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="container-site py-24">
        <div className="grid gap-5 md:grid-cols-2">
          {(
            [
              ["Our mission", mission],
              ["Our vision", vision],
            ] as const
          ).map(([title, copy], i) => (
            <Reveal key={title} delay={i} from={i ? "right" : "left"}>
              <div className="m3-card h-full p-8 md:p-10">
                <p className="eyebrow">{title}</p>
                <p className="mt-5 font-display text-xl leading-snug font-bold md:text-2xl">
                  {copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Machinery & facility */}
      <section className="bg-surface-1 py-24">
        <div className="container-site">
          <Reveal from="left">
            <p className="eyebrow">Machinery & facility</p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] font-extrabold">
              Modern machines, run by skilled technicians.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              A well-equipped plant with its own boiler, compressor, water supply, laboratory and
              delivery vans, supervised by qualified wash experts.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal from="left">
              <div className="m3-card h-full p-8">
                <h3 className="font-display text-xl font-extrabold">Machinery</h3>
                <dl className="mt-5 divide-y divide-border">
                  {machinery.map(([name, count]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-sm text-muted-foreground">{name}</dt>
                      <dd className="font-display text-lg font-extrabold text-primary">{count}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
            <Reveal from="right">
              <div className="m3-card h-full p-8">
                <h3 className="font-display text-xl font-extrabold">Facility</h3>
                <dl className="mt-5 divide-y divide-border">
                  {facility.map(([name, value]) => (
                    <div
                      key={name}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <dt className="text-sm text-muted-foreground">{name}</dt>
                      <dd className="text-sm font-semibold sm:text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Photo pair */}
      <section className="container-site grid gap-4 py-24 md:grid-cols-2">
        <Reveal from="left" tilt>
          <img
            src="/images/v2/qc-inspection.jpg"
            alt="Operator checking a washed denim garment on the quality inspection table"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-4xl border border-border object-cover shadow-elev-1"
          />
        </Reveal>
        <Reveal from="right" tilt>
          <img
            src="/images/v2/pp-spray.jpg"
            alt="Team applying PP spray to a pair of jeans in the dry process area"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-4xl border border-border object-cover shadow-elev-1"
          />
        </Reveal>
      </section>

      {/* Find the plant */}
      <section className="bg-surface-1 py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal from="left" tilt>
            <img
              src="/images/v3/plant-gate.jpg"
              alt="The blue and yellow entrance gate and signboard of Glassy Washing Plant, House 13, Wazuddin Road, Vatara, Dhaka"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-4xl border border-border object-cover shadow-elev-2"
            />
          </Reveal>
          <Reveal from="right">
            <p className="eyebrow">Find the plant</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] font-extrabold">
              Look for the
              <br />
              blue gate.
            </h2>
            <address className="mt-6 text-base leading-relaxed text-muted-foreground not-italic">
              {company.address}
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <M3Button href={company.phoneHref}>
                Call {company.phone} <ArrowRight size={15} />
              </M3Button>
              <M3Button to="/contact" variant="outlined">
                Send a brief <ArrowRight size={15} />
              </M3Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        eyebrow="Come see the difference"
        title="Bring the hard brief."
        copy="House 13, Wazuddin Rd, Vatara, Dhaka 1212. Come see the floor and leave with a clearer way forward."
      />
    </>
  );
}
