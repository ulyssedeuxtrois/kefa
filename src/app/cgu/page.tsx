export default function CguPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conditions générales d&apos;utilisation</h1>
      <p className="text-sm text-gray-400 mb-8">Version 1.0 — mars 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Objet</h2>
          <p className="text-gray-600">
            Les présentes CGU régissent l&apos;utilisation de la plateforme <strong>Ziben</strong>,
            accessible à l&apos;adresse ziben.fr. En utilisant Ziben, vous acceptez sans réserve les
            présentes conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Définitions</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li><strong>Plateforme</strong> : le service Ziben accessible via le site et l&apos;application mobile</li>
            <li><strong>Utilisateur</strong> : toute personne consultant la plateforme</li>
            <li><strong>Organisateur</strong> : utilisateur ayant créé un compte pour publier des événements</li>
            <li><strong>Événement</strong> : toute manifestation référencée sur la plateforme</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Accès au service</h2>
          <p className="text-gray-600">
            La consultation des événements est gratuite et sans inscription. La publication d&apos;événements
            nécessite la création d&apos;un compte organisateur ou peut se faire via un formulaire public
            soumis à validation.
          </p>
          <p className="text-gray-600 mt-2">
            Ziben se réserve le droit de suspendre ou supprimer tout compte en cas de non-respect des CGU,
            sans préavis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Publication d&apos;événements</h2>
          <p className="text-gray-600">
            L&apos;organisateur s&apos;engage à :
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
            <li>Fournir des informations exactes et à jour sur ses événements</li>
            <li>Ne publier que des événements légaux et conformes à la réglementation française</li>
            <li>Mettre à jour ou signaler l&apos;annulation d&apos;un événement dans les plus brefs délais</li>
            <li>Ne pas publier de contenu trompeur, offensant, discriminatoire ou illégal</li>
            <li>Détenir les droits sur les contenus (textes, images) soumis</li>
          </ul>
          <p className="text-gray-600 mt-3">
            Ziben se réserve le droit de refuser ou supprimer tout événement sans justification.
            La validation n&apos;engage pas Ziben sur la tenue effective de l&apos;événement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Service de mise en avant (Boost)</h2>
          <p className="text-gray-600">
            Le service de mise en avant est une option payante permettant de positionner un événement
            en tête des résultats pendant une durée déterminée (7, 14 ou 30 jours).
          </p>
          <p className="text-gray-600 mt-2">
            <strong>Tarifs :</strong> 5 € / 9 € / 15 € selon la durée choisie (TTC, paiement unique).
          </p>
          <p className="text-gray-600 mt-2">
            Le boost prend effet immédiatement après confirmation du paiement. Aucun remboursement ne
            sera accordé une fois le service activé, sauf annulation de l&apos;événement par l&apos;organisateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Responsabilité</h2>
          <p className="text-gray-600">
            Ziben est un intermédiaire technique. La plateforme n&apos;est pas organisatrice des événements
            listés et ne saurait être tenue responsable de :
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-2">
            <li>L&apos;annulation ou la modification d&apos;un événement</li>
            <li>L&apos;exactitude des informations fournies par les organisateurs</li>
            <li>Tout dommage survenant lors de la participation à un événement</li>
            <li>L&apos;indisponibilité temporaire du service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Propriété intellectuelle</h2>
          <p className="text-gray-600">
            La marque, le logo, le code et les contenus originaux de Ziben sont protégés. Les organisateurs
            conservent la propriété de leurs contenus et accordent à Ziben une licence d&apos;affichage
            gratuite, non exclusive, pour la durée de présence sur la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Modification des CGU</h2>
          <p className="text-gray-600">
            Ziben se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
            seront informés par notification sur la plateforme. La poursuite de l&apos;utilisation du service
            après modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Droit applicable</h2>
          <p className="text-gray-600">
            Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence
            des tribunaux du ressort de Nice (06).
          </p>
          <p className="text-gray-600 mt-2">
            Contact : <a href="mailto:contact@ziben.fr" className="text-primary-600 hover:underline">contact@ziben.fr</a>
          </p>
        </section>
      </div>
    </div>
  );
}
