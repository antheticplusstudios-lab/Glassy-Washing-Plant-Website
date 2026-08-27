import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileText } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, SplitText } from "@/components/motion-primitives";
import { M3Button } from "@/components/site-shell";
import { company } from "@/lib/site-data";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Glassy Washing Plant Bangladesh" },
      {
        name: "description",
        content:
          "Read the Terms of Service for Glassy Washing Plant, covering website use, quotations, garment washing services, client accounts, intellectual property, payments, liability and Bangladesh law.",
      },
      { property: "og:title", content: "Terms of Service — Glassy Washing Plant" },
      {
        property: "og:description",
        content:
          "Plain-language terms for using the Glassy Washing Plant website and engaging our garment washing and finishing services.",
      },
    ],
    links: seoLinks("/terms-of-service"),
  }),
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <article>
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-2 to-background">
        <div className="container-site py-20 md:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container">
              <FileText size={16} /> Website & service terms
            </div>
          </Reveal>
          <SplitText
            as="h1"
            text="Terms of Service"
            className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.94] font-extrabold"
          />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
            These terms explain the rules for using this website and the basic framework for
            enquiries, quotations and service discussions with Glassy Washing Plant.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: 26 August 2026 · Last updated: 26 August 2026
          </p>
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-12 text-sm leading-7 text-muted-foreground">
          <TermsSection title="1. Agreement">
            <p>
              By using this website, submitting an enquiry, creating a client account or engaging
              {` `}{company.name} for services, you agree to these Terms of Service and our{" "}
              <a className="text-primary underline" href="/privacy-policy">Privacy Policy</a>.
              If you are acting for a company or brand, you confirm that you have authority to act
              on its behalf.
            </p>
          </TermsSection>

          <TermsSection title="2. What we provide">
            <p>
              Glassy Washing Plant provides garment washing, dyeing, dry-process and finishing
              services described on this website. Actual processes, capacity, lead time, minimum
              quantities, pricing and technical results depend on the specific garment, fabric,
              approved standard, order and production conditions.
            </p>
            <p>
              Website descriptions are general service information and do not create a guarantee that
              every process is available for every material or order.
            </p>
          </TermsSection>

          <TermsSection title="3. Quotations and orders">
            <ul className="list-disc space-y-2 pl-5">
              <li>A website enquiry is a request for discussion, not an automatically accepted order.</li>
              <li>Prices, quantities, delivery dates and technical specifications become binding only when confirmed through an authorised quotation, purchase order, work order or other written commercial agreement.</li>
              <li>A quotation may depend on the supplied garment, quantity, wash standard, chemicals, special effects, testing requirements and other production conditions.</li>
              <li>Changes requested after approval may affect price, timing or feasibility and may require written confirmation.</li>
            </ul>
          </TermsSection>

          <TermsSection title="4. Samples, approvals and colour">
            <p>
              Washing and dyeing are process-sensitive. Garment construction, fabric composition,
              dye lot, trims, previous treatments, machine conditions and approved standards can
              affect the final result. Where applicable, clients should review and approve samples,
              shade standards and measurements before bulk production.
            </p>
            <p>
              A sample approval is used as the agreed production reference for the relevant order.
              Exact visual uniformity cannot be promised where the material or process naturally
              produces variation.
            </p>
          </TermsSection>

          <TermsSection title="5. Client responsibilities">
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide accurate garment, quantity, composition and technical information.</li>
              <li>Provide references, buyer standards and approvals when required.</li>
              <li>Ensure that supplied materials and instructions do not infringe another party's rights.</li>
              <li>Make timely decisions and provide required approvals, materials and information.</li>
              <li>Pay agreed charges according to the applicable commercial terms.</li>
            </ul>
          </TermsSection>

          <TermsSection title="6. Payments, delivery and changes">
            <p>
              Payment terms, delivery dates, transport arrangements, taxes, duties and other
              commercial conditions are governed by the applicable quotation or written agreement.
              Delays caused by missing approvals, late materials, changes in specifications, events
              outside reasonable control, or other client-side dependencies may affect the schedule.
            </p>
          </TermsSection>

          <TermsSection title="7. Intellectual property and confidentiality">
            <p>
              Glassy Washing Plant retains rights in its own website, branding, original text,
              graphics, software and other materials. Clients retain their rights in brand assets,
              references and materials they lawfully provide to us, subject to any separate agreement.
            </p>
            <p>
              Both parties should treat genuinely confidential commercial information responsibly.
              If a project requires a formal confidentiality or non-disclosure agreement, the signed
              agreement will govern the confidential information covered by it.
            </p>
          </TermsSection>

          <TermsSection title="8. Website use">
            <p>
              You must not misuse the website, attempt unauthorised access, interfere with its
              operation, introduce malicious code, impersonate another person, submit unlawful
              material, or use information obtained from the website in a way that violates
              applicable law or another person's rights.
            </p>
          </TermsSection>

          <TermsSection title="9. Third-party services">
            <p>
              Parts of the website may rely on third-party infrastructure for hosting, authentication,
              database, email or other technical functions. Those providers may have their own terms
              and privacy policies. We select services for legitimate operational purposes but cannot
              guarantee the availability or uninterrupted operation of an independent third-party
              service.
            </p>
          </TermsSection>

          <TermsSection title="10. Availability and information accuracy">
            <p>
              We aim to keep the website useful and accurate, but information may change without
              notice. We do not promise that the website will always be available, error-free or
              completely current. Technical and commercial information should be confirmed with our
              team before it is relied upon for a purchase or production decision.
            </p>
          </TermsSection>

          <TermsSection title="11. Liability">
            <p>
              To the extent permitted by applicable law, Glassy Washing Plant is not responsible for
              indirect, incidental, special or consequential losses arising from website use or from
              matters outside our reasonable control. Nothing in these terms excludes or limits a
              responsibility that cannot lawfully be excluded or limited under Bangladesh law.
            </p>
            <p>
              For an actual production order, the applicable written commercial agreement, quotation,
              purchase order and approved specifications should be reviewed for the specific allocation
              of responsibility and remedies.
            </p>
          </TermsSection>

          <TermsSection title="12. Events beyond reasonable control">
            <p>
              We may be unable to perform or may experience delay because of circumstances beyond
              reasonable control, including natural disasters, major utility failures, transport
              disruption, government action, industrial disruption, serious equipment failure,
              widespread technology outages or other comparable events. We will take reasonable steps
              to communicate material delays and resume performance.
            </p>
          </TermsSection>

          <TermsSection title="13. Suspension or termination">
            <p>
              We may restrict website access or suspend an account where reasonably necessary for
              security, abuse prevention, legal compliance or breach of these terms. A commercial
              service relationship may be ended or changed according to the applicable written
              agreement.
            </p>
          </TermsSection>

          <TermsSection title="14. Governing law">
            <p>
              These terms are governed by the laws applicable in Bangladesh, subject to any mandatory
              rights or remedies available under applicable law. Commercial disputes should first be
              addressed through good-faith discussion between the parties and, where an agreement
              specifies a dispute-resolution procedure, that procedure will apply.
            </p>
          </TermsSection>

          <TermsSection title="15. Changes to these terms">
            <p>
              We may update these terms when the website, services or legal requirements change.
              The latest version will be published on this page with a new effective date. Continued
              website use after an update means you accept the revised website terms to the extent
              permitted by law.
            </p>
          </TermsSection>

          <div className="rounded-3xl border border-border bg-surface-1 p-7">
            <p className="eyebrow">Need a commercial answer?</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">
              Let's confirm the details in writing.
            </h2>
            <p className="mt-3">
              For pricing, lead times, technical requirements or an actual production programme,
              contact the Glassy team and request a written quotation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <M3Button to="/contact">Request a quote <ArrowRight size={15} /></M3Button>
              <M3Button to="/privacy-policy" variant="outlined">Privacy Policy</M3Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function TermsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-extrabold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
