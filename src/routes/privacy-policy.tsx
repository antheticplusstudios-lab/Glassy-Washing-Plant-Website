import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, SplitText } from "@/components/motion-primitives";
import { M3Button } from "@/components/site-shell";
import { company } from "@/lib/site-data";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Glassy Washing Plant Bangladesh" },
      {
        name: "description",
        content:
          "Glassy Washing Plant's Privacy Policy explains in plain language what personal information we collect, why we use it, how we protect it, and the choices available to users.",
      },
      { property: "og:title", content: "Privacy Policy — Glassy Washing Plant" },
      {
        property: "og:description",
        content:
          "Clear information about privacy, personal data, contact forms and client accounts at Glassy Washing Plant.",
      },
    ],
    links: seoLinks("/privacy-policy"),
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <article>
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-2 to-background">
        <div className="container-site py-20 md:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container">
              <ShieldCheck size={16} /> Privacy & data protection
            </div>
          </Reveal>
          <SplitText
            as="h1"
            text="Privacy Policy"
            className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.94] font-extrabold"
          />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
            We want you to understand exactly what happens to information you share with Glassy
            Washing Plant. This policy is written for ordinary users as well as business clients.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective date: 26 August 2026 · Last updated: 26 August 2026
          </p>
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-12 text-sm leading-7 text-muted-foreground">
          <PolicySection title="1. Who we are">
            <p>
              This website is operated by <strong className="text-foreground">{company.name}</strong>,
              a garment washing and finishing business based in Vatara, Dhaka, Bangladesh. For
              privacy questions, contact us at{" "}
              <a className="text-primary underline" href={company.emailHref}>{company.email}</a> or{" "}
              <a className="text-primary underline" href={company.phoneHref}>{company.phone}</a>.
            </p>
          </PolicySection>

          <PolicySection title="2. Information we collect">
            <p>Depending on how you use the website, we may receive:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Contact details such as your name, email address and phone number.</li>
              <li>Business details such as company or brand name, service requirements and order-related information you choose to send.</li>
              <li>Messages, garment references and other information you include in a quotation or contact request.</li>
              <li>Account information when you create or use a client account, such as your email address and profile name.</li>
              <li>Technical information needed to operate and secure the website, such as browser, device, IP-related security information and basic usage information.</li>
            </ul>
            <p>
              Please do not send passwords, payment-card numbers, government identification numbers,
              or other highly sensitive information through a normal contact message unless we
              specifically request it through a secure and appropriate process.
            </p>
          </PolicySection>

          <PolicySection title="3. Why we use information">
            <p>We use information only for legitimate business and website purposes, including to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to enquiries, quotation requests and service briefs.</li>
              <li>Plan, discuss and manage garment washing, dyeing, dry-process and finishing work.</li>
              <li>Provide and secure client account functionality.</li>
              <li>Send service-related replies and important account or operational messages.</li>
              <li>Maintain website security, prevent abuse and troubleshoot technical problems.</li>
              <li>Meet applicable legal, regulatory, accounting or dispute-resolution requirements.</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Client briefs and business information">
            <p>
              Information you provide about garments, brands, quantities, wash standards, references,
              production requirements or commercial plans is treated as business information. We use it
              to understand and fulfil your request, communicate with you, maintain appropriate records,
              and protect our legitimate business interests.
            </p>
            <p>
              We do not claim ownership of your brand assets or garment references merely because you
              send them to us. Any separate confidentiality, intellectual-property or commercial
              agreement continues to apply where one exists.
            </p>
          </PolicySection>

          <PolicySection title="5. Service providers and data sharing">
            <p>
              We may use carefully selected technology providers to operate this website and its
              functions. The current application uses Supabase for authentication and database
              services and Resend for transactional email delivery. Information may therefore be
              processed by these providers as necessary to provide the requested service.
            </p>
            <p>
              We do not sell personal information. We may disclose information where reasonably
              necessary to provide a service, protect the website or business, comply with a lawful
              request, enforce an agreement, or protect the rights and safety of people or property.
            </p>
          </PolicySection>

          <PolicySection title="6. Security">
            <p>
              We use reasonable technical and organisational measures appropriate to the nature of
              the information we handle. These include controlled access, authentication controls,
              server-side handling of sensitive operations, and security practices provided by our
              technology infrastructure.
            </p>
            <p>
              No website or internet transmission can be guaranteed to be completely secure. If we
              become aware of a material security incident affecting personal information, we will
              take appropriate steps required by applicable law and our incident-response procedures.
            </p>
          </PolicySection>

          <PolicySection title="7. Cookies and similar technologies">
            <p>
              The website may use essential browser storage, session technologies and similar
              mechanisms required for authentication, security, preferences and normal operation.
              We do not use this policy to promise that every browser, analytics or third-party
              technology behaves identically; settings and providers can change as the website evolves.
            </p>
          </PolicySection>

          <PolicySection title="8. Retention">
            <p>
              We keep information for as long as reasonably necessary for the purpose for which it
              was collected, including managing client relationships, maintaining business records,
              resolving disputes, preventing abuse and meeting legal obligations. Retention periods
              may differ depending on the type of record.
            </p>
          </PolicySection>

          <PolicySection title="9. Your privacy choices">
            <p>
              Subject to applicable law and reasonable verification, you may contact us to ask what
              personal information we hold about you, request correction of inaccurate information,
              ask about deletion where legally appropriate, or raise a concern about how your
              information is handled.
            </p>
            <p>
              Some information may need to be retained when we have a lawful reason to do so, such as
              legal obligations, fraud prevention, contractual records or dispute resolution.
            </p>
          </PolicySection>

          <PolicySection title="10. Children">
            <p>
              Our website and services are intended for businesses, professionals and general adult
              users. We do not knowingly design the service to collect personal information from
              children. If you believe a child has provided personal information to us, please contact
              us so we can review the situation and take appropriate action.
            </p>
          </PolicySection>

          <PolicySection title="11. Bangladesh law and regulatory compliance">
            <p>
              We operate in Bangladesh and seek to handle personal information in accordance with
              applicable Bangladeshi laws and regulations, including applicable data-protection,
              cybersecurity and electronic-transaction requirements as they come into force or are
              amended.
            </p>
            <p>
              This policy is intended to be clear and compliance-oriented, but it is not a substitute
              for legal advice. Where a mandatory legal requirement provides a different rule, the
              applicable law prevails.
            </p>
          </PolicySection>

          <PolicySection title="12. Changes to this policy">
            <p>
              We may update this Privacy Policy when our services, technology or legal obligations
              change. The latest version will be published on this page with an updated effective date.
            </p>
          </PolicySection>

          <div className="rounded-3xl border border-border bg-surface-1 p-7">
            <p className="eyebrow">Questions?</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground">
              Ask us directly.
            </h2>
            <p className="mt-3">
              For privacy requests or questions about information submitted through this website,
              contact {company.name}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <M3Button to="/contact">Contact us <ArrowRight size={15} /></M3Button>
              <M3Button to="/terms-of-service" variant="outlined">Terms of Service</M3Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-extrabold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
