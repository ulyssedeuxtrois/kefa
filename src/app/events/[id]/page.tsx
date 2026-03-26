"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Tag,
  Heart,
  Share2,
  ArrowLeft,
  User,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { EventMap } from "@/components/map/EventMap";
import { useAuth } from "@/lib/auth";
import type { EventWithCategory } from "@/lib/types";

export default function EventPage() {
  const params = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setEvent(data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  async function toggleSave() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const res = await fetch("/api/events/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, eventId: event!.id }),
    });
    const data = await res.json();
    setSaved(data.saved);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: event!.title,
        text: `Découvre cet événement sur Ziben : ${event!.title}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
        <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-6" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Événement non trouvé</h1>
        <p className="text-gray-500 mb-6">
          Cet événement n&apos;existe pas ou a été supprimé.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="relative aspect-[16/9] bg-gray-100 rounded-2xl overflow-hidden mb-6">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary-100 to-accent-100">
            {event.category.icon}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
            {event.category.icon} {event.category.name}
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h1>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-primary-600" />
              <span>
                {formatTime(event.date)}
                {event.endDate && ` — ${formatTime(event.endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span>
                {event.location} · {event.address}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Tag className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">
                {formatPrice(event.price, event.isFree)}
              </span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-lg font-semibold mb-2">À propos</h2>
            <p className="text-gray-600 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Localisation</h2>
            <EventMap
              events={[event]}
              center={[event.lat, event.lng]}
              zoom={15}
              className="w-full h-[300px] rounded-2xl"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="card p-5">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatPrice(event.price, event.isFree)}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {formatDate(event.date)} · {formatTime(event.date)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={toggleSave}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-xl font-medium transition-colors ${
                    saved
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "btn-secondary"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${saved ? "fill-red-500" : ""}`}
                  />
                  {saved ? "Sauvegardé" : "Sauvegarder"}
                </button>
                <button
                  onClick={share}
                  className="flex-1 btn-secondary flex items-center justify-center gap-1.5 text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Organisateur
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <p className="font-medium text-gray-900">
                  {event.organizer.name || "Anonyme"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
