import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <p className="text-7xl mb-6">🔍</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Oups, page introuvable
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          L&apos;événement ou la page que tu cherches n&apos;existe pas (ou plus).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Retour à l&apos;accueil
          </Link>
          <Link href="/map" className="btn-secondary inline-flex items-center gap-2">
            🗺️ Voir la carte
          </Link>
        </div>
      </div>
    </div>
  );
}
