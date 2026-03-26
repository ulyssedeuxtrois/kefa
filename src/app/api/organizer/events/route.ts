import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/organizer/events?userId=xxx
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      category: true,
      _count: { select: { savedBy: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    total: events.length,
    pending: events.filter((e) => e.status === "PENDING").length,
    approved: events.filter((e) => e.status === "APPROVED").length,
    rejected: events.filter((e) => e.status === "REJECTED").length,
  };

  return NextResponse.json({ events, counts });
}
