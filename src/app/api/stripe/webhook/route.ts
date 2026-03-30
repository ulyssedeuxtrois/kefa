import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { eventId, days } = session.metadata!;

    const boostedUntil = new Date();
    boostedUntil.setDate(boostedUntil.getDate() + Number(days));

    await prisma.event.update({
      where: { id: eventId },
      data: { boosted: true, boostedUntil },
    });
  }

  return NextResponse.json({ received: true });
}

// Stripe needs raw body — disable Next.js body parsing
export const config = { api: { bodyParser: false } };
