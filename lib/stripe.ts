import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      "pk_test_51U9UFTB0TnC5PhNseoW15J3PMvysFlMJZore5GKQlYanFP7NiTkEgAw8xZXIzvfybI9CfIqKbBBjLFOo9er0yiBU00QVizq5n0";
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
