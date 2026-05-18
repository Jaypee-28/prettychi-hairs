import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // We don't throw here to avoid crashing build/runtime if not yet configured, 
  // but we should warn in dev.
  console.warn("STRIPE_SECRET_KEY is missing. Stripe integration will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia" as any,
  typescript: true,
});
