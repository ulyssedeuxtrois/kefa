"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

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
          "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
          !activeCategory
            ? "bg-primary-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
        )}
      >
        Tout
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => selectCategory(cat.slug)}
          className={cn(
            "flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
            activeCategory === cat.slug
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          )}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
