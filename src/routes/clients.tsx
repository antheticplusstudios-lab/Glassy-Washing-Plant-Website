import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Reveal, SplitText, TiltCard } from "@/components/motion-primitives";
import { CtaPanel } from "./index";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Who We Serve — Clients & Partners | Glassy Washing Plant" },
      {
        name: "description",
        content:
          "Glassy partners with denim brands, garment manufacturers, export houses and private labels who need repeatable wash quality.",
      },
      { property: "og:title", content: "Who We Serve — Glassy Washing Plant" },
      {
        property: "og:description",
        content: "A wash partner, not a black box: clear communication and process control.",
      },
    ],
    links: seoLinks("/clients"),
  }),
  component: Clients,
});

const sectors: [string, string][] = [
  ["Denim brands", "Labels protecting a signature wash across every drop, in every market."],
  [
    "Garment manufacturers",
    "Production partners who need a wash house that keeps pace with the sewing line.",
  ],
  ["Export houses", "Exporters balancing buyer standards, tight calendars and zero room for rework."],
  ["Private labels", "Growing labels ready to make finish quality part of the brand language."],
];

const promises = [
  "One accountable point of contact",
  "Samples that explain themselves",
  "Recipe cards kept on file for repeats",
  "Shade banding before dispatch",
  "Any wash standard, matched",
  "Updates without chasing",
];

function Clients() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src="/images/qc-inspection.jpg"
          alt="Quality inspection of a washed garment"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/40" />
        <div className="container-site py-28">
          <p className="eyebrow">For the people behind the label</p>
          <SplitText
            as="h1"
            text="Your finish is our signature."
            className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6.4vw,4.8rem)] leading-[0.96] font-extrabold"
          />
        </div>
      </section>

      <section className="container-site py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <Reveal from="left">
            <p className="eyebrow">Built around your pressure</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
              A wash partner,
              <br />
              not a black box.
            </h2>
          </Reveal>
          <Reveal from="right">
            <p className="text-base leading-relaxed text-muted-foreground">
              You bring the standard, the deadline and the ambition. We bring the communication and
              process control to get it over the line.
            </p>
          </Reveal>
        </div>

        <div className="perspective-scene mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map(([title, copy], i) => (
            <Reveal key={title} delay={i} from={i % 2 ? "down" : "up"} tilt>
              <TiltCard className="m3-card h-full p-7">
                <span className="font-mono text-xs text-primary">0{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface-1 py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal from="left" tilt>
            <img
              src="/images/swatches.jpg"
              alt="Denim shade swatches arranged for quality control"
              loading="lazy"
              className="w-full rounded-4xl border border-border object-cover shadow-elev-2"
            />
          </Reveal>
          <Reveal from="right">
            <p className="eyebrow">The Glassy promise</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1] font-extrabold">
              Clear by
              <br />
              construction.
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {promises.map((promise) => (
                <p key={promise} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                    <Check size={13} />
                  </span>
                  {promise}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaPanel
        eyebrow="Let's make it feel right"
        title="Good partners make the hard parts quiet."
        copy="Tell us about the programme, the buyer standard and the calendar. We will come back with a clear next step."
      />
    </>
  );
}
