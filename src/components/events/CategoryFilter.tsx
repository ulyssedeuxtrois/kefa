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
          "chip flex-shrink-0",
          !activeCategory ? "chip-active" : "chip-inactive"
        )}
      >
        Tout
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => selectCategory(cat.slug)}
          className={cn(
            "chip flex-shrink-0 whitespace-nowrap",
            activeCategory === cat.slug ? "chip-active" : "chip-inactive"
          )}
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
