import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      organizer: { select: { id: true, name: true, avatar: true } },
      _count: { select: { savedBy: true } },
    },
  });

  if (!event) {
    return NextResponse.json(
      { error: "Événement non trouvé" },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}

// PUT /api/events/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        price: body.price,
        isFree: body.isFree,
        imageUrl: body.imageUrl,
        categoryId: body.categoryId,
        status: body.status,
      },
      include: { category: true },
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
