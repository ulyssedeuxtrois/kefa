import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ziben.onrender.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event.findMany({
    where: { status: "APPROVED" },
    select: { id: true, updatedAt: true },
    orderBy: { date: "asc" },
  });

  const eventUrls = events.map((event) => ({
    url: `${BASE_URL}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/map`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...eventUrls,
  ];
}
