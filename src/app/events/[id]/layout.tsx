import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!event) return {};

  const description = event.description?.slice(0, 160);

  return {
    title: `${event.title} — Kefa`,
    description,
    openGraph: {
      title: `${event.title} — Kefa`,
      description,
      images: event.imageUrl
        ? [event.imageUrl]
        : [{ url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://kefa.app"}/icons/icon-512.png`, width: 512, height: 512 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} — Kefa`,
      description,
      images: event.imageUrl ? [event.imageUrl] : ["/icons/icon-512.png"],
    },
  };
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
