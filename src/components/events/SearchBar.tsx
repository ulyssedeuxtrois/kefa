"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un événement, un lieu..."
          className="flex-1 px-3 py-3.5 bg-transparent outline-none text-sm placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl mr-1.5 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
