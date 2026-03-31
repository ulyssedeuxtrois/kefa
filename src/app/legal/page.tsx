export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentions légales</h1>
      <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : mars 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Éditeur du site</h2>
          <p className="text-gray-600">
            Le site <strong>Kefa</strong> (kefa.app / kefa.app) est édité à titre personnel par :<br />
            <strong>Ulysse Sigalat</strong><br />
            Adresse : Nice, France (06)<br />
            Email : contact@kefa.app<br />
            Statut : auto-entrepreneur / personne physique
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Hébergement</h2>
          <p className="text-gray-600">
            Le site est hébergé par :<br />
            <strong>Render Inc.</strong><br />
            525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis<br />
            <a href="https://render.com" className="text-primary-600 hover:underline">render.com</a>
          </p>
          <p className="text-gray-600 mt-2">
            La base de données est hébergée par :<br />
            <strong>Neon Inc.</strong> — PostgreSQL serverless<br />
            <a href="https://neon.tech" className="text-primary-600 hover:underline">neon.tech</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Activité</h2>
          <p className="text-gray-600">
            Kefa est une plateforme de référencement d&apos;événements locaux à Nice et ses environs.
            Le service permet aux organisateurs de publier leurs événements et au public de les découvrir.
            La plateforme n&apos;organise pas elle-même les événements référencés.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Responsabilité</h2>
          <p className="text-gray-600">
            Les informations publiées sur Kefa sont fournies par les organisateurs d&apos;événements.
            Kefa ne saurait être tenu responsable des erreurs, omissions ou indisponibilités dans
            les informations relatives aux événements (dates, lieux, tarifs, annulations).
          </p>
          <p className="text-gray-600 mt-2">
            Il appartient à chaque utilisateur de vérifier auprès de l&apos;organisateur les informations
            pratiques avant de se déplacer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Propriété intellectuelle</h2>
          <p className="text-gray-600">
            Le code source, le design et les contenus originaux de Kefa sont la propriété exclusive
            d&apos;Ulysse Sigalat. Toute reproduction totale ou partielle est interdite sans autorisation
            préalable.
          </p>
          <p className="text-gray-600 mt-2">
            Les contenus soumis par les utilisateurs (descriptions d&apos;événements, images) restent la
            propriété de leurs auteurs. En les soumettant sur Kefa, ils accordent à la plateforme
            une licence d&apos;affichage non exclusive et gratuite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Paiements</h2>
          <p className="text-gray-600">
            Les paiements en ligne (boost d&apos;événements) sont traités par <strong>Stripe Inc.</strong>,
            prestataire de paiement sécurisé. Kefa ne stocke aucune donnée bancaire.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Droit applicable</h2>
          <p className="text-gray-600">
            Le présent site est soumis au droit français. Tout litige sera de la compétence
            exclusive des tribunaux français.
          </p>
        </section>
      </div>
    </div>
  );
}
