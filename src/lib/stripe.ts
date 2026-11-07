import "server-only";

import Stripe from "stripe";

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !secretKey.startsWith("sk_test_")) {
    throw new Error("Stripe test secret key is missing or invalid.");
  }

  return new Stripe(secretKey);
}