import { Suspense } from "react";
import { SearchBar } from "@/components/events/SearchBar";
import { CategoryFilter } from "@/components/events/CategoryFilter";
import { EventList } from "@/components/events/EventList";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Trouve quoi faire{" "}
            <span className="text-primary-600">près de chez toi</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Concerts, marchés, ateliers, soirées... Tous les événements de ta
            ville en un seul endroit.
          </p>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Categories + Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="card animate-pulse"
                  >
                    <div className="aspect-[16/10] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <EventList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
