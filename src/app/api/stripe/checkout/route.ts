import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const BOOST_OPTIONS = [
  { days: 7,  price: 500,  label: "1 semaine" },
  { days: 14, price: 900,  label: "2 semaines" },
  { days: 30, price: 1500, label: "1 mois" },
];

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });

  const { eventId, days } = await req.json();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, status: true },
  });

  if (!event || event.status !== "APPROVED") {
    return NextResponse.json({ error: "Event non trouvé ou non approuvé" }, { status: 404 });
  }

  const option = BOOST_OPTIONS.find((o) => o.days === days);
  if (!option) {
    return NextResponse.json({ error: "Option invalide" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ziben.onrender.com";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: option.price,
          product_data: {
            name: `Mise en avant — ${option.label}`,
            description: `"${event.title}" apparaît en tête de liste pendant ${option.label}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      eventId: event.id,
      days: String(days),
    },
    success_url: `${baseUrl}/events/${event.id}?boosted=1`,
    cancel_url: `${baseUrl}/events/${event.id}`,
  });

  return NextResponse.json({ url: session.url });
}
