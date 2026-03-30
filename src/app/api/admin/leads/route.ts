import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/leads — organizers + recent public submitters
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.SCRAPER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [organizers, publicSubmitters] = await Promise.all([
    // Registered organizers with their event count
    prisma.user.findMany({
      where: { role: "ORGANIZER" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        events: {
          select: { id: true, title: true, status: true, date: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: { select: { events: true } },
      },
      orderBy: { createdAt: "desc" },
    }),

    // Public submissions (no account) — unique by email
    prisma.event.findMany({
      where: {
        organizerId: null,
        submitterEmail: { not: null },
      },
      select: {
        id: true,
        title: true,
        submitterName: true,
        submitterEmail: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  // Déduplique les soumissions publiques par email
  const seenEmails = new Set<string>();
  const uniquePublic = publicSubmitters.filter((e) => {
    if (!e.submitterEmail || seenEmails.has(e.submitterEmail)) return false;
    seenEmails.add(e.submitterEmail);
    return true;
  });

  return NextResponse.json({
    organizers,
    publicLeads: uniquePublic,
    stats: {
      totalOrganizers: organizers.length,
      totalPublicLeads: uniquePublic.length,
      totalLeads: organizers.length + uniquePublic.length,
    },
  });
}
