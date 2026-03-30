import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { sendWeeklyDigest } from "@/lib/email";

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) return auth.error;

  const now = new Date();
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [events, users] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: "APPROVED",
        date: { gte: now, lte: weekLater },
      },
      include: { category: { select: { icon: true, name: true } } },
      orderBy: { date: "asc" },
      take: 7,
    }),
    prisma.user.findMany({
      where: { email: { not: undefined } },
      select: { id: true, email: true, name: true },
    }),
  ]);

  const results = await Promise.allSettled(
    users.map((u) =>
      sendWeeklyDigest(
        u.email,
        events.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date.toISOString(),
          location: e.location,
          category: { icon: e.category.icon, name: e.category.name },
        })),
        u.name ?? undefined
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ sent, failed });
}
