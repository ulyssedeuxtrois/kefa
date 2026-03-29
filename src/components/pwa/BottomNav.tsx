"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, PlusCircle, Heart, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/map", icon: Map, label: "Carte" },
  { href: "/submit", icon: PlusCircle, label: "Proposer", highlight: true },
  { href: "/saved", icon: Heart, label: "Sauvegardés" },
  { href: "/login", icon: User, label: "Compte" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, highlight }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors ${
                highlight
                  ? "text-primary-500"
                  : isActive
                  ? "text-primary-600"
                  : "text-gray-400"
              }`}
            >
              {highlight ? (
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-200 -mt-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? "fill-primary-100" : ""}`} />
              )}
              <span className={`text-[10px] font-medium ${highlight ? "mt-1" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
