"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

// Couleur d'accent par catégorie quand inactive
const CAT_INACTIVE_STYLE: Record<string, string> = {
  "musique-soirees":        "bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100",
  "arts-spectacles":        "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100",
  "culture-expositions":    "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100",
  "conferences-savoirs":    "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100",
  "vie-locale":             "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100",
  "sport-bien-etre":        "bg-green-50 text-green-700 border-green-100 hover:bg-green-100",
  "food-degustations":      "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100",
  "famille-enfants":        "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100",
  "nature-decouvertes":     "bg-lime-50 text-lime-700 border-lime-100 hover:bg-lime-100",
  "jeux-geek":              "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
  "business-networking":    "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100",
  "evenements-saisonniers": "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100",
};

// Couleur d'accent par catégorie quand active
const CAT_ACTIVE_STYLE: Record<string, string> = {
  "musique-soirees":        "bg-violet-600 text-white shadow-lg shadow-violet-500/30 border-transparent",
  "arts-spectacles":        "bg-rose-600 text-white shadow-lg shadow-rose-500/30 border-transparent",
  "culture-expositions":    "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-transparent",
  "conferences-savoirs":    "bg-teal-600 text-white shadow-lg shadow-teal-500/30 border-transparent",
  "vie-locale":             "bg-amber-500 text-white shadow-lg shadow-amber-500/30 border-transparent",
  "sport-bien-etre":        "bg-green-600 text-white shadow-lg shadow-green-500/30 border-transparent",
  "food-degustations":      "bg-orange-500 text-white shadow-lg shadow-orange-500/30 border-transparent",
  "famille-enfants":        "bg-pink-500 text-white shadow-lg shadow-pink-500/30 border-transparent",
  "nature-decouvertes":     "bg-lime-600 text-white shadow-lg shadow-lime-500/30 border-transparent",
  "jeux-geek":              "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-transparent",
  "business-networking":    "bg-slate-700 text-white shadow-lg shadow-slate-500/30 border-transparent",
  "evenements-saisonniers": "bg-sky-600 text-white shadow-lg shadow-sky-500/30 border-transparent",
};

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === activeCategory) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => selectCategory("")}
        className={cn(
          "chip flex-shrink-0",
          !activeCategory ? "chip-active" : "chip-inactive"
        )}
      >
        Tout
      </button>
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => selectCategory(cat.slug)}
            className={cn(
              "chip flex-shrink-0 whitespace-nowrap border",
              isActive
                ? (CAT_ACTIVE_STYLE[cat.slug] || "chip-active")
                : (CAT_INACTIVE_STYLE[cat.slug] || "chip-inactive")
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
