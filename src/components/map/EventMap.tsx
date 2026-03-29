"use client";

import { useEffect, useRef } from "react";
import type { EventWithCategory } from "@/lib/types";

interface EventMapProps {
  events: EventWithCategory[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function EventMap({
  events,
  center = [43.7102, 7.2620], // Nice par défaut
  zoom = 13,
  className = "w-full h-[400px] rounded-2xl",
}: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Import Leaflet dynamically (SSR-safe)
    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Add event markers
      events.forEach((event) => {
        if (event.lat && event.lng) {
          const marker = L.marker([event.lat, event.lng]).addTo(map);
          marker.bindPopup(`
            <div style="min-width:180px">
              <strong>${event.title}</strong><br/>
              <small>${event.category.icon} ${event.category.name}</small><br/>
              <small>${event.location}</small><br/>
              <a href="/events/${event.id}" style="color:#0074c5;font-size:12px">Voir détails →</a>
            </div>
          `);
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events, center, zoom]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} className={className} />
    </>
  );
}
