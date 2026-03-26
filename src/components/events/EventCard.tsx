"use client";

import Link from "next/link";
import { Calendar, MapPin, Heart } from "lucide-react";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import type { EventWithCategory } from "@/lib/types";

interface EventCardProps {
  event: EventWithCategory;
}

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/events/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, eventId: event.id }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch {}
    setSaving(false);
  }

  return (
    <Link href={`/events/${event.id}`} className="card group block">
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-primary-100 to-accent-100">
            {event.category.icon}
          </div>
        )}

        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full">
          {event.category.icon} {event.category.name}
        </span>

        <button
          onClick={toggleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full">
          {formatPrice(event.price, event.isFree)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {formatDate(event.date)} · {formatTime(event.date)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>
    </Link>
  );
}
