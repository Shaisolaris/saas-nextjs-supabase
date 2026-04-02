import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export const PLANS = {
  free: { name: "Free", price: 0, limits: { projects: 3, members: 2, storage_gb: 1 }, features: ["3 projects", "2 team members", "1 GB storage", "Community support"] },
  pro: { name: "Pro", price: 29, priceId: "price_pro_monthly", limits: { projects: 25, members: 10, storage_gb: 50 }, features: ["25 projects", "10 team members", "50 GB storage", "Priority support", "Custom domains", "API access"] },
  enterprise: { name: "Enterprise", price: 99, priceId: "price_enterprise_monthly", limits: { projects: -1, members: -1, storage_gb: 500 }, features: ["Unlimited projects", "Unlimited members", "500 GB storage", "Dedicated support", "SSO", "Audit logs", "SLA guarantee"] },
} as const;

export async function createCheckoutSession(teamId: string, priceId: string, customerId?: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing?cancelled=true`,
    customer: customerId || undefined,
    metadata: { team_id: teamId },
    subscription_data: { trial_period_days: 14, metadata: { team_id: teamId } },
  });
  return session;
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
  });
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}
