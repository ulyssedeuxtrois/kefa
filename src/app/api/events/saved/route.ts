import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events/saved?userId=xxx — get saved events for a user
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  const saved = await prisma.savedEvent.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          category: true,
          organizer: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { event: { date: "asc" } },
  });

  const events = saved.map((s) => s.event);
  return NextResponse.json({ events });
}

// POST /api/events/saved — save or unsave an event
export async function POST(request: NextRequest) {
  try {
    const { userId, eventId } = await request.json();
    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "userId et eventId requis" },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedEvent.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      // Unsave
      await prisma.savedEvent.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await prisma.savedEvent.create({
        data: { userId, eventId },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
