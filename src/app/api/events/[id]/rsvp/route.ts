import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/events/[id]/rsvp — toggle RSVP
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { sessionId, name } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId requis" }, { status: 400 });
    }

    const existing = await prisma.rsvp.findUnique({
      where: { eventId_sessionId: { eventId: id, sessionId } },
    });

    if (existing) {
      await prisma.rsvp.delete({ where: { id: existing.id } });
      await prisma.event.update({
        where: { id },
        data: { rsvpCount: { decrement: 1 } },
      });
      return NextResponse.json({ attending: false });
    }

    await prisma.rsvp.create({
      data: { eventId: id, sessionId, name: name || null },
    });
    const event = await prisma.event.update({
      where: { id },
      data: { rsvpCount: { increment: 1 } },
    });

    return NextResponse.json({ attending: true, count: event.rsvpCount });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

// GET /api/events/[id]/rsvp?sessionId=xxx — check RSVP status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const sessionId = new URL(request.url).searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ attending: false });
  }

  const rsvp = await prisma.rsvp.findUnique({
    where: { eventId_sessionId: { eventId: id, sessionId } },
  });

  return NextResponse.json({ attending: !!rsvp });
}
