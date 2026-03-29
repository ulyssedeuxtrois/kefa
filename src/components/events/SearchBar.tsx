"use client";

import { Search } from "lucide-react";
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
      <div className="flex items-center bg-white rounded-full shadow-xl shadow-black/10 focus-within:shadow-2xl focus-within:shadow-black/15 transition-shadow">
        <Search className="w-5 h-5 text-gray-400 ml-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Concert, karaoké, marché, atelier..."
          className="flex-1 px-4 py-4 bg-transparent outline-none text-sm placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full mr-1.5 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
