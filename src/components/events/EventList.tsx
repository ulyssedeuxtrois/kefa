"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard } from "./EventCard";
import { Filters } from "./Filters";
import type { EventWithCategory } from "@/lib/types";
import { Calendar, Frown, Loader2 } from "lucide-react";

export function EventList() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const loadMore = useCallback(() => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) => [...prev, ...(data.events || [])]);
        setPage(data.page || nextPage);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, page, totalPages, searchParams]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-lg">
            {total > 0 ? `${total} événement${total > 1 ? "s" : ""}` : "Événements"}
          </h2>
        </div>
        <Filters />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {page < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement…
                  </>
                ) : (
                  "Voir plus d\u2019événements"
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Frown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Aucun événement trouvé
          </h3>
          <p className="text-gray-500 text-sm">
            Essaie de modifier tes filtres ou ta recherche
          </p>
        </div>
      )}
    </div>
  );
}
