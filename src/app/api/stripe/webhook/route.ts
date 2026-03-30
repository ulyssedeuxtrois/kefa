import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { notifyBoost } from "@/lib/notify";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
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

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { boosted: true, boostedUntil },
      select: { id: true, title: true },
    });

    notifyBoost({
      id: updated.id,
      title: updated.title,
      days: Number(days),
      amount: (session.amount_total ?? 0),
    }).catch(() => {});
  }

  return NextResponse.json({ received: true });
}
