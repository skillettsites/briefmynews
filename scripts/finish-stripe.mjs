// Turnkey Stripe finisher for BriefMyNews.
//
// You only need to provide ONE thing: your BriefMyNews Stripe SECRET key.
// This script then does everything else and verifies a live Pro checkout:
//   1. Creates the webhook endpoint via the Stripe API (returns its signing secret)
//   2. Adds STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to Vercel (production)
//   3. Triggers a redeploy
//   4. Creates a real Checkout Session and confirms the hosted page returns 200
//
// Usage (from the briefmynews dir):
//   STRIPE_SECRET_KEY=sk_test_xxx node scripts/finish-stripe.mjs
//
// Test keys (sk_test_...) are perfect for verification: no real money moves.

import Stripe from "stripe";
import { execSync } from "node:child_process";

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY || !/^sk_(test|live)_/.test(KEY)) {
  console.error("Set STRIPE_SECRET_KEY=sk_test_... (or sk_live_...) and re-run.");
  process.exit(1);
}
const SITE = "https://briefmynews.com";
const stripe = new Stripe(KEY);

function setVercelEnv(name, value) {
  // Remove any existing value, then add. Pipe the value on stdin.
  try {
    execSync(`npx vercel env rm ${name} production --yes`, { stdio: "ignore" });
  } catch {
    /* not set yet */
  }
  execSync(`npx vercel env add ${name} production`, { input: value, stdio: ["pipe", "ignore", "ignore"] });
  console.log(`  set ${name}`);
}

(async () => {
  console.log("1) Creating Stripe webhook endpoint...");
  const wh = await stripe.webhookEndpoints.create({
    url: `${SITE}/api/webhooks/stripe`,
    enabled_events: [
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
    ],
  });
  console.log(`   endpoint ${wh.id}`);

  console.log("2) Writing env to Vercel...");
  setVercelEnv("STRIPE_SECRET_KEY", KEY);
  setVercelEnv("STRIPE_WEBHOOK_SECRET", wh.secret);

  console.log("3) Redeploying (git empty commit)...");
  execSync(`git commit -q --allow-empty -m "Enable Stripe billing" && git push origin master`, { stdio: "ignore" });

  console.log("4) Creating a test checkout session...");
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: "qa@briefmynews.com",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "BriefMyNews Pro (annual)" },
          unit_amount: 2999,
          recurring: { interval: "year" },
        },
        quantity: 1,
      },
    ],
    success_url: `${SITE}/dashboard?upgraded=1`,
    cancel_url: `${SITE}/pricing`,
  });
  const res = await fetch(session.url);
  console.log(`   checkout session ${session.id}`);
  console.log(`   hosted page status: ${res.status} ${res.status === 200 ? "OK" : "(check)"}`);
  console.log(`   open to test a card: ${session.url}`);
  console.log("\nDone. Once you complete a test payment, the webhook flips that user's tier to pro.");
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
