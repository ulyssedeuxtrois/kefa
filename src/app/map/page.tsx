"use client";

import { useEffect, useState } from "react";
import { EventMap } from "@/components/map/EventMap";
import type { EventWithCategory } from "@/lib/types";

export default function MapPage() {
  const [events, setEvents] = useState<EventWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events?limit=100")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-[calc(100vh-64px)]">
      {loading ? (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
          <p className="text-gray-400">Chargement de la carte...</p>
        </div>
      ) : (
        <EventMap
          events={events}
          center={[43.7102, 7.2620]}
          className="w-full h-full"
          zoom={13}
        />
      )}
    </div>
  );
}
