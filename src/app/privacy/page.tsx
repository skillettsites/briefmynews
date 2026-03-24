import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BriefMyNews privacy policy. Learn how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://briefmynews.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: 24 March 2026</p>

      <div className="mt-8 space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            1. Who We Are
          </h2>
          <p>
            BriefMyNews (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            is a UK-based personalised news digest service operated at
            briefmynews.com. We are committed to protecting your privacy and
            handling your data transparently.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            2. Data We Collect
          </h2>
          <p>We collect the following information:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong className="text-foreground">Account data:</strong> email address, display
              name, and password (hashed).
            </li>
            <li>
              <strong className="text-foreground">Preferences:</strong> your selected topics,
              sources, political lean setting, and delivery schedule.
            </li>
            <li>
              <strong className="text-foreground">Usage data:</strong> digest delivery logs,
              open rates, and click-through rates to improve our service.
            </li>
            <li>
              <strong className="text-foreground">Waitlist data:</strong> email address and
              signup source for those joining before launch.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            3. How We Use Your Data
          </h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Create and manage your account</li>
            <li>Generate and deliver your personalised news digests</li>
            <li>Improve our article matching and summary quality</li>
            <li>Send service-related communications (e.g., account updates)</li>
            <li>Notify waitlist members when the service launches</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            4. What We Will Never Do
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Sell your personal data to third parties</li>
            <li>Send you promotional emails unrelated to our service</li>
            <li>Share your email with advertisers or data brokers</li>
            <li>Use your data for targeted advertising</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            5. Data Storage and Security
          </h2>
          <p>
            Your data is stored securely using Supabase, which provides
            encrypted storage and secure authentication. Passwords are hashed
            using industry-standard algorithms. We use HTTPS for all data
            transmission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            6. Your Rights
          </h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, contact us at
            privacy@briefmynews.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            7. Cookies
          </h2>
          <p>
            We use essential cookies for authentication and session management.
            We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            8. Third-Party Services
          </h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong className="text-foreground">Supabase:</strong> database and
              authentication
            </li>
            <li>
              <strong className="text-foreground">Vercel:</strong> hosting and
              deployment
            </li>
            <li>
              <strong className="text-foreground">Stripe:</strong> payment
              processing (Pro plan)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. We will notify
            registered users of any significant changes via email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            10. Contact
          </h2>
          <p>
            If you have questions about this privacy policy, contact us at
            privacy@briefmynews.com.
          </p>
        </section>
      </div>
    </div>
  );
}
