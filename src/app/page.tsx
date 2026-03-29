import { Suspense } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/events/SearchBar";
import { CategoryFilter } from "@/components/events/CategoryFilter";
import { EventList } from "@/components/events/EventList";
import { TimeFilter } from "@/components/events/TimeFilter";
import { MapPin, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-400 to-accent-400 pt-16 pb-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-300/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* City badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nice</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Ce soir,{" "}
            <span className="relative">
              tu fais quoi ?
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            Concerts, karaoké, marchés, ateliers, expos...
            <br className="hidden sm:block" />
            Tous les bons plans de ta ville, au même endroit.
          </p>

          <Suspense>
            <SearchBar />
          </Suspense>

          {/* Time filters */}
          <div className="mt-8 flex justify-center">
            <Suspense>
              <TimeFilter />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Categories + Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Suspense>
          <CategoryFilter />
        </Suspense>

        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
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

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary-400" />
                <span className="text-primary-400 font-semibold text-sm uppercase tracking-wide">
                  Organisateurs & commerçants
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Tu organises un événement ?
              </h2>
              <p className="text-gray-400 max-w-lg">
                Karaoke, vide-grenier, concert, atelier... Publie ton event gratuitement et touche les gens autour de toi.
              </p>
            </div>
            <Link
              href="/submit"
              className="btn-primary flex items-center gap-2 whitespace-nowrap text-base"
            >
              Publier un event
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
