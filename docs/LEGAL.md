# Cadre juridique — Kefa

## Statut légal recommandé

### Phase actuelle (MVP, < 5 000 €/an de revenus)
**Aucune structure nécessaire.** Tu peux facturer sous ton nom en tant que **personne physique**.
Pour les paiements Stripe, créer un compte en tant que "particulier" ou "auto-entrepreneur" est suffisant.

### Dès que les revenus deviennent réguliers
**Créer une micro-entreprise (auto-entrepreneur) :**
- Inscription sur autoentrepreneur.urssaf.fr (gratuit, 15 min)
- Code APE : **6201Z** (Programmation informatique) ou **7990Z** (Autres services de réservation)
- Régime : micro-BIC (si ventes) ou micro-BNC (si prestations)
- TVA : franchise de TVA jusqu'à 36 800 €/an de CA (pas de TVA à facturer)
- Charges sociales : ~22% du CA encaissé

### Si CA > 72 600 € ou structure d'équipe
Passer en **SAS/SASU** (flexibilité, levée de fonds possible). Coût : ~500 € de création + comptable.

---

## Obligations légales en place

### RGPD (Règlement Général sur la Protection des Données)
- [x] Politique de confidentialité accessible (`/privacy`)
- [x] Base légale documentée pour chaque traitement
- [x] Sous-traitants identifiés (Render, Neon, Stripe)
- [x] Droits des utilisateurs explicités
- [x] Pas de cookies tiers
- [ ] **À faire** : registre des activités de traitement (document interne — obligatoire si plus de 250 personnes)
- [ ] **À faire** : DPO non requis pour l'instant (petite structure, pas de traitement de données sensibles)

### Loi pour la Confiance dans l'Économie Numérique (LCEN)
- [x] Mentions légales accessibles (`/legal`)
- [x] Hébergeur identifié
- [x] Éditeur identifié
- [ ] **À faire** : signalement de contenu illicite (formulaire de contact suffit pour l'instant)

### CGU
- [x] CGU accessibles (`/cgu`)
- [x] Limitation de responsabilité documentée
- [x] Règles publication d'events

---

## Fiscalité des revenus Kefa

### Sources de revenus
1. **Boost d'events** (5€/9€/15€) → vente de service numérique B2B ou B2C
2. **Éventuellement** : abonnement organisateur, publicité, partenariats

### Régime TVA
- **Sous le seuil de franchise** (36 800 €) : pas de TVA à collecter, mention "TVA non applicable, art. 293B du CGI" sur les factures
- **Au-dessus** : TVA 20% à collecter et reverser à l'État

### Stripe et comptabilité
- Stripe génère des rapports de transactions téléchargeables (dashboard → Reports)
- Stripe peut émettre des relevés mensuels
- Les frais Stripe (~1,5% + 0,25€/transaction CB française) sont déductibles

### Comptabilité simplifiée
Pour une micro-entreprise, tenir à jour :
- Un tableau de recettes mensuel (date, client, montant, description)
- Les justificatifs de dépenses (hébergement, domaine, outils)

Outils gratuits : Shine, Qonto, ou un simple tableur.

---

## Propriété intellectuelle

### Ce que tu possèdes
- La marque "Kefa" (non déposée — à déposer à l'INPI si tu veux la protéger, ~250 € pour 10 ans)
- Le code source (droit d'auteur automatique, pas besoin de dépôt)
- Le design original

### Ce que tu utilises (licences)
- Next.js : MIT
- Tailwind CSS : MIT
- Prisma : Apache 2.0
- Stripe SDK : MIT
- Leaflet : BSD-2-Clause
- Lucide React : ISC

Tout est compatible avec un usage commercial. Aucune obligation de publier ton code.

### Contenu des utilisateurs
Les events publiés appartiennent aux organisateurs. En publiant, ils accordent à Kefa une licence d'affichage (mentionné dans les CGU).

---

## Points d'attention juridiques

### Ce que tu NE peux pas faire
- Revendre les données des organisateurs/utilisateurs à des tiers
- Envoyer des emails marketing sans opt-in explicite (RGPD)
- Facturer sans fournir un justificatif/facture (obligation légale)

### Ce qu'il faut prévoir
- **Factures** : pour chaque paiement Stripe, Stripe génère automatiquement un reçu. Pour des factures françaises conformes, utiliser Stripe Invoicing ou émettre manuellement.
- **Signalement** : prévoir une adresse email de signalement pour les contenus inappropriés
- **Mineurs** : si des events pour mineurs sont publiés, prévoir un avertissement

### Responsabilité organisateurs
Les organisateurs sont responsables de leurs events. Kefa n'est qu'un intermédiaire technique (statut d'hébergeur au sens de la LCEN). Ce statut exonère Kefa de la responsabilité du contenu sauf si le contenu illicite lui est signalé et qu'il n'est pas retiré promptement.

---

## Checklist légale avant lancement

- [x] Pages légales en ligne (CGU, Privacy, Mentions légales)
- [ ] Créer une micro-entreprise (avant d'encaisser de l'argent)
- [ ] Ouvrir un compte bancaire pro (Shine/Qonto gratuit ou quasi)
- [ ] Configurer Stripe avec SIREN/SIRET une fois la micro créée
- [ ] Déposer la marque "Kefa" à l'INPI (si budget dispo)
- [ ] Ajouter un formulaire de signalement de contenu
