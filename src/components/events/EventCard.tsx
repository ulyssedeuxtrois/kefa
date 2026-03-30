"use client";

import Link from "next/link";
import { MapPin, Heart, Users, Zap } from "lucide-react";
import { formatTime, formatPrice, formatRelativeDate, formatCapacity, formatCountdown } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import type { EventWithCategory } from "@/lib/types";

interface EventCardProps {
  event: EventWithCategory;
}

// Gradient + déco par catégorie — chaque event a une identité visuelle
const CAT_STYLES: Record<string, { gradient: string; dot: string }> = {
  "musique-soirees":       { gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)", dot: "#c4b5fd" },
  "arts-spectacles":       { gradient: "linear-gradient(135deg, #881337 0%, #e11d48 50%, #fb7185 100%)", dot: "#fda4af" },
  "culture-expositions":   { gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)", dot: "#93c5fd" },
  "conferences-savoirs":   { gradient: "linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #2dd4bf 100%)", dot: "#99f6e4" },
  "vie-locale":            { gradient: "linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%)", dot: "#fde68a" },
  "sport-bien-etre":       { gradient: "linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%)", dot: "#bbf7d0" },
  "food-degustations":     { gradient: "linear-gradient(135deg, #78350f 0%, #ea580c 50%, #fb923c 100%)", dot: "#fed7aa" },
  "famille-enfants":       { gradient: "linear-gradient(135deg, #831843 0%, #ec4899 50%, #f9a8d4 100%)", dot: "#fbcfe8" },
  "nature-decouvertes":    { gradient: "linear-gradient(135deg, #1a2e05 0%, #4d7c0f 50%, #84cc16 100%)", dot: "#d9f99d" },
  "jeux-geek":             { gradient: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #818cf8 100%)", dot: "#c7d2fe" },
  "business-networking":   { gradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)", dot: "#cbd5e1" },
  "evenements-saisonniers":{ gradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)", dot: "#bae6fd" },
};

const DEFAULT_STYLE = { gradient: "linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)", dot: "#d1d5db" };

// Photos Unsplash par catégorie — fallback quand l'event n'a pas d'image
const CAT_PHOTOS: Record<string, string> = {
  "musique-soirees":        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
  "arts-spectacles":        "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&h=400&fit=crop",
  "culture-expositions":    "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop",
  "conferences-savoirs":    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  "vie-locale":             "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
  "sport-bien-etre":        "https://images.unsplash.com/photo-1461896836934-bd45ba10a444?w=600&h=400&fit=crop",
  "food-degustations":      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
  "famille-enfants":        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&h=400&fit=crop",
  "nature-decouvertes":     "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
  "jeux-geek":              "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
  "business-networking":    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
  "evenements-saisonniers": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop",
};

export function EventCard({ event }: EventCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const relativeDate = formatRelativeDate(event.date);
  const countdown = formatCountdown(event.date);
  const capacityText = formatCapacity(event.capacity, event.rsvpCount);
  const isTonight = relativeDate === "Ce soir";
  const isBoosted = event.boosted && event.boostedUntil && new Date(event.boostedUntil) > new Date();

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { window.location.href = "/login"; return; }
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

  const style = CAT_STYLES[event.category.slug] || DEFAULT_STYLE;

  return (
    <Link href={`/events/${event.id}`} className="card group block">
      <div className="h-1 w-full" style={{ background: style.gradient }} />
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.imageUrl || CAT_PHOTOS[event.category.slug] || ""}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback gradient si l'image charge pas
            const target = e.currentTarget;
            target.style.display = "none";
            target.parentElement?.classList.add("cat-fallback");
          }}
        />

        {/* Gradient overlay en bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge catégorie — haut gauche */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
          {event.category.icon} {event.category.name}
        </span>

        {/* Bouton save — haut droite */}
        <button
          onClick={toggleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 hover:scale-110 transition-all border border-white/10"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${saved ? "fill-red-400 text-red-400" : "text-white"}`} />
        </button>

        {/* Badge boost — si en vedette */}
        {isBoosted && (
          <span className="absolute top-3 right-12 inline-flex items-center gap-0.5 bg-yellow-400/90 backdrop-blur-sm text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 fill-yellow-900" />
            Top
          </span>
        )}

        {/* Date — bas gauche */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          {countdown ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/40 animate-pulse">
              🔴 {countdown}
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              isTonight
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/40"
                : "bg-white/90 backdrop-blur-sm text-gray-800"
            }`}>
              {relativeDate} · {formatTime(event.date)}
            </span>
          )}
        </div>

        {/* Prix — bas droite */}
        <span className={`absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          event.isFree
            ? "bg-accent-500 text-white shadow-lg shadow-accent-500/40"
            : "bg-white/90 backdrop-blur-sm text-gray-800"
        }`}>
          {formatPrice(event.price, event.isFree)}
        </span>
      </div>

      <div className="px-4 pt-3 pb-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors line-clamp-1 text-[15px]">
          {event.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary-400" />
          <span className="line-clamp-1">{event.location}</span>
          {event.distanceKm != null && (
            <span className="ml-auto flex-shrink-0 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {event.distanceKm < 1
                ? `${Math.round(event.distanceKm * 1000)} m`
                : `${event.distanceKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {(event.rsvpCount > 0 || capacityText) && (
          <div className="mt-2 flex items-center gap-3">
            {event.rsvpCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-primary-600 font-medium bg-primary-50 dark:bg-primary-900/20 rounded-full px-2.5 py-0.5">
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
