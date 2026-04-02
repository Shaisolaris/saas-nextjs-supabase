import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { teamId, priceId, customerId } = await req.json();

  if (!teamId || !priceId) {
    return NextResponse.json({ error: "Missing teamId or priceId" }, { status: 400 });
  }

  try {
    const session = await createCheckoutSession(teamId, priceId, customerId);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
