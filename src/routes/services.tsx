import { createFileRoute } from "@tanstack/react-router";
import { M3Button } from "@/components/site-shell";
import { Reveal, SplitText } from "@/components/motion-primitives";
import { processMenu, washes, washLibrary } from "@/lib/site-data";
import { CtaPanel } from "./index";
import { ArrowRight } from "lucide-react";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Garment Washing Services in Bangladesh | Glassy Washing Plant" },
      {
        name: "description",
        content:
          "Garment washing services in Dhaka, Bangladesh: denim, enzyme, stone, bleach, acid, pigment, overdye, dry process and garment finishing.",
      },
      { property: "og:title", content: "Garment Washing Services in Bangladesh | Glassy" },
      {
        property: "og:description",
        content:
          "Garment washing, denim washing, dyeing and finishing processes developed and run on the Glassy production floor in Dhaka.",
      },
    ],
    links: seoLinks("/services"),
  }),
  component: Services,
});

function Services() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Garment Washing, Dyeing & Finishing",
    serviceType: "Garment washing and finishing",
    description:
      "Commercial garment washing, dyeing, dry process and handwork services for fashion brands and garment manufacturers.",
    provider: {
      "@type": "LocalBusiness",
      name: "Glassy Washing Plant",
      telephone: "+8801819195026",
      address: {
        "@type": "PostalAddress",
        streetAddress: "House 13, Wazuddin Rd, Vatara",
        addressLocality: "Dhaka",
        postalCode: "1212",
        addressCountry: "BD",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wash capabilities",
      itemListElement: washes.map((wash) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: wash.title,
          description: wash.copy,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <section className="container-site pt-20 pb-14">
        <p className="eyebrow">Services / Wash capabilities</p>
        <SplitText
          as="h1"
          text="Finish is a feeling."
          className="mt-4 font-display text-[clamp(2.8rem,7vw,5.2rem)] leading-[0.95] font-extrabold"
        />
        <Reveal delay={2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            From clean commercial enzyme to hand-placed whisker, we develop and run the processes
            that give a garment its reason to exist.
          </p>
        </Reveal>
      </section>

      <section className="bg-surface-1 py-24">
        <div className="container-site">
          <Reveal from="left">
            <p className="eyebrow">The wash library</p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
              Every finish we run, in plain English.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Browse process photos and plain-English notes to understand each stage. Use the notes to pick the finish, then
              send us your reference and we will advise on the right process.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {washLibrary.map((item, i) => (
              <Reveal key={item.id} delay={i % 3} from="up">
                <article className="m3-card h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={`${item.title}: ${item.detail}`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-6">
                    <span className="eyebrow">{item.id} / {washLibrary.length}</span>
                    <h3 className="mt-2 font-display text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-24">
        <Reveal from="left">
          <p className="eyebrow">Full process menu</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1] font-extrabold">
            Wet processing and dry processing under one roof.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {(
            [
              ["Wet processing", processMenu.wet],
              ["Dry processing", processMenu.dry],
            ] as const
          ).map(([heading, items], i) => (
            <Reveal key={heading} delay={i} from={i ? "right" : "left"}>
              <div className="m3-card h-full p-8">
                <h3 className="font-display text-2xl font-extrabold">{heading}</h3>
                <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span
                        aria-hidden
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface-1 py-24 text-center">
        <div className="container-site">
          <p className="eyebrow">One floor. No handoffs.</p>
          <SplitText
            text="A recipe is only useful when it can be repeated."
            className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] leading-[1] font-extrabold"
          />
          <div className="mt-10">
            <M3Button to="/contact">
              Talk to the wash house <ArrowRight size={16} />
            </M3Button>
          </div>
        </div>
      </section>

      <CtaPanel
        eyebrow="Have a standard to match?"
        title="Send the swatch."
        copy="Share the approved standard or reference garment — we will match shade, contrast and hand-feel, then document the recipe."
      />
    </>
  );
}
