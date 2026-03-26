import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events — list events with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const isFree = searchParams.get("free") === "true";
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {
    status: "APPROVED",
  };

  // SQLite doesn't support mode: "insensitive", use raw contains
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { location: { contains: query } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (isFree) {
    where.isFree = true;
  }

  if (dateFrom) {
    where.date = { ...where.date, gte: new Date(dateFrom) };
  }

  if (dateTo) {
    where.date = { ...where.date, lte: new Date(dateTo + "T23:59:59") };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        category: true,
        organizer: { select: { id: true, name: true } },
        _count: { select: { savedBy: true } },
      },
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({
    events,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/events — create an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        price: body.price || 0,
        isFree: body.isFree ?? body.price === 0,
        imageUrl: body.imageUrl || null,
        categoryId: body.categoryId,
        organizerId: body.organizerId,
        status: "PENDING",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'événement" },
      { status: 500 }
    );
  }
}
