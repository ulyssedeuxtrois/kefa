"use client";

import Link from "next/link";
import { Calendar, MapPin, Heart, Users } from "lucide-react";
import { formatDate, formatTime, formatPrice, formatRelativeDate, formatCapacity } from "@/lib/utils";
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

  const relativeDate = formatRelativeDate(event.date);
  const capacityText = formatCapacity(event.capacity, event.rsvpCount);
  const isTonight = relativeDate === "Ce soir";

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
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary-50 via-warm-50 to-accent-50">
            {event.category.icon}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-3 left-3 glass text-xs font-semibold px-3 py-1 rounded-full bg-white/85">
          {event.category.icon} {event.category.name}
        </span>

        {/* Save button */}
        <button
          onClick={toggleSave}
          className="absolute top-3 right-3 w-9 h-9 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Date badge - bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
            isTonight ? "bg-primary-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-800"
          }`}>
            {relativeDate} · {formatTime(event.date)}
          </span>
        </div>

        {/* Price badge - bottom right */}
        <span className={`absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          event.isFree ? "bg-accent-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-800"
        }`}>
          {formatPrice(event.price, event.isFree)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-1 text-[15px]">
          {event.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* RSVP / Capacity */}
        {(event.rsvpCount > 0 || capacityText) && (
          <div className="mt-2 flex items-center gap-3">
            {event.rsvpCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                <Users className="w-3 h-3" />
                {event.rsvpCount} y {event.rsvpCount > 1 ? "vont" : "va"}
              </span>
            )}
            {capacityText && (
              <span className={`text-xs font-medium ${
                capacityText === "Complet" ? "text-red-500" : "text-orange-500"
              }`}>
                {capacityText}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
