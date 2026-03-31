export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : mars 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Responsable du traitement</h2>
          <p className="text-gray-600">
            Ulysse Sigalat — contact@kefa.app — Nice, France.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Données collectées</h2>
          <div className="text-gray-600 space-y-3">
            <div>
              <strong>Sans inscription (visiteur) :</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Aucune donnée personnelle collectée</li>
                <li>Logs techniques côté serveur (adresse IP, user-agent) — conservation 30 jours</li>
                <li>Token de notification push (si accepté) — stocké en base, lié à l&apos;appareil uniquement</li>
              </ul>
            </div>
            <div>
              <strong>Avec inscription (organisateur) :</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Email, nom/prénom, mot de passe (haché SHA-256 + sel)</li>
                <li>Événements publiés et leurs métadonnées</li>
              </ul>
            </div>
            <div>
              <strong>Lors d&apos;une soumission publique :</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Nom, email (optionnels, fournis volontairement)</li>
                <li>Contenu de l&apos;événement soumis</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Finalités et bases légales</h2>
          <table className="w-full text-sm text-gray-600 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 border border-gray-200">Finalité</th>
                <th className="text-left px-3 py-2 border border-gray-200">Base légale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Création et gestion de compte</td>
                <td className="px-3 py-2 border border-gray-200">Exécution du contrat</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Publication d&apos;événements</td>
                <td className="px-3 py-2 border border-gray-200">Exécution du contrat</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Notifications push (opt-in)</td>
                <td className="px-3 py-2 border border-gray-200">Consentement</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Statistiques de consultation</td>
                <td className="px-3 py-2 border border-gray-200">Intérêt légitime</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Paiement (boost)</td>
                <td className="px-3 py-2 border border-gray-200">Exécution du contrat</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Sous-traitants</h2>
          <table className="w-full text-sm text-gray-600 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 border border-gray-200">Prestataire</th>
                <th className="text-left px-3 py-2 border border-gray-200">Rôle</th>
                <th className="text-left px-3 py-2 border border-gray-200">Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Render Inc.</td>
                <td className="px-3 py-2 border border-gray-200">Hébergement application</td>
                <td className="px-3 py-2 border border-gray-200">États-Unis (SCCs)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Neon Inc.</td>
                <td className="px-3 py-2 border border-gray-200">Base de données</td>
                <td className="px-3 py-2 border border-gray-200">États-Unis (SCCs)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-gray-200">Stripe Inc.</td>
                <td className="px-3 py-2 border border-gray-200">Paiements en ligne</td>
                <td className="px-3 py-2 border border-gray-200">États-Unis (certifié DPF)</td>
              </tr>
            </tbody>
          </table>
          <p className="text-sm text-gray-500 mt-2">
            Aucune donnée n&apos;est vendue ou cédée à des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Durées de conservation</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Comptes utilisateurs : jusqu&apos;à suppression par l&apos;utilisateur ou 3 ans d&apos;inactivité</li>
            <li>Événements : jusqu&apos;à suppression manuelle par l&apos;admin</li>
            <li>Soumissions publiques : 2 ans</li>
            <li>Logs techniques : 30 jours</li>
            <li>Tokens push : jusqu&apos;à désinscription</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Vos droits (RGPD)</h2>
          <p className="text-gray-600 mb-2">
            Conformément au RGPD (UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li><strong>Accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Rectification</strong> : corriger des données inexactes</li>
            <li><strong>Effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Portabilité</strong> : recevoir vos données dans un format structuré</li>
            <li><strong>Opposition</strong> : vous opposer au traitement fondé sur l&apos;intérêt légitime</li>
            <li><strong>Limitation</strong> : limiter le traitement dans certains cas</li>
          </ul>
          <p className="text-gray-600 mt-3">
            Pour exercer ces droits : <a href="mailto:contact@kefa.app" className="text-primary-600 hover:underline">contact@kefa.app</a>
          </p>
          <p className="text-gray-600 mt-2">
            En cas de réclamation non résolue, vous pouvez saisir la <strong>CNIL</strong> : <a href="https://www.cnil.fr" className="text-primary-600 hover:underline">cnil.fr</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Cookies</h2>
          <p className="text-gray-600">
            Kefa utilise uniquement les cookies strictement nécessaires au fonctionnement de la session
            (authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
          </p>
        </section>
      </div>
    </div>
  );
}
