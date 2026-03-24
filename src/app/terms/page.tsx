import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "BriefMyNews terms of service. Read about the rules and conditions for using our personalised news digest service.",
  alternates: { canonical: "https://briefmynews.com/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 24 March 2026</p>

      <div className="mt-8 space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using BriefMyNews (&ldquo;the Service&rdquo;), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. Description of Service
          </h2>
          <p>
            BriefMyNews is a personalised news digest service that aggregates,
            summarises, and delivers news articles based on your selected topics,
            sources, and schedule preferences. We do not create original news
            content; we curate and summarise articles from third-party sources.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. Account Registration
          </h2>
          <p>
            To use certain features, you must register for an account. You are
            responsible for maintaining the security of your account credentials.
            You must provide accurate, current information during registration.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. Free and Pro Plans
          </h2>
          <p>
            The Service offers a free tier and a paid Pro tier. The free tier
            includes limited topics, sources, and weekly delivery. The Pro tier
            ($29.99/year) provides unlimited access to all features.
            Pricing may change with 30 days&apos; notice to existing subscribers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. Payment and Billing
          </h2>
          <p>
            Pro subscriptions are billed annually. Payments are processed
            securely through Stripe. You may cancel at any time; access continues
            until the end of your billing period. We do not offer refunds for
            partial billing periods.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Content and Copyright
          </h2>
          <p>
            The news articles summarised in our digests are sourced from
            third-party publishers via their public RSS feeds. All original
            content remains the property of its respective publishers. Our
            AI-generated summaries are provided for convenience; we always link
            back to the original source.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            7. Acceptable Use
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>
              Attempt to gain unauthorised access to other users&apos; accounts
            </li>
            <li>Redistribute our digest content commercially</li>
            <li>Use automated systems to scrape or collect data from the Service</li>
            <li>Interfere with the proper functioning of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            8. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of
            any kind. We do not guarantee the accuracy, completeness, or
            timeliness of the news summaries provided. We are not responsible for
            the content published by third-party news sources.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            9. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by UK law, BriefMyNews shall not be
            liable for any indirect, incidental, or consequential damages arising
            from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            10. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these terms. You may delete your account at any time through
            your dashboard settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            11. Governing Law
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws
            of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            12. Contact
          </h2>
          <p>
            Questions about these terms? Contact us at legal@briefmynews.com.
          </p>
        </section>
      </div>
    </div>
  );
}
