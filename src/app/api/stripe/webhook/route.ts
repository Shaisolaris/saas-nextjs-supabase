import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const teamId = session.metadata?.team_id;
      if (teamId && session.subscription) {
        await supabase.from("teams").update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: "active",
          plan: "pro",
        }).eq("id", teamId);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const teamId = sub.metadata?.team_id;
      if (teamId) {
        await supabase.from("teams").update({ subscription_status: sub.status }).eq("id", teamId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const teamId = sub.metadata?.team_id;
      if (teamId) {
        await supabase.from("teams").update({ subscription_status: "cancelled", plan: "free" }).eq("id", teamId);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.subscription as string;
      const { data } = await supabase.from("teams").select("id").eq("stripe_subscription_id", sub).single();
      if (data) {
        await supabase.from("teams").update({ subscription_status: "past_due" }).eq("id", data.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
