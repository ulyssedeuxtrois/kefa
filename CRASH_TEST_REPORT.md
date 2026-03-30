# Crash Test Report — Ziben
**Date :** 30 mars 2026
**URL :** https://ziben.onrender.com
**Stack :** Next.js 14, TypeScript, Tailwind, Prisma, PostgreSQL Neon
**Testeur :** Claude (Puppeteer headless)

---

## Résumé

| Catégorie | Nb |
|---|---|
| Bugs critiques (bloquants) | 3 |
| Bugs bloquants | 2 |
| Problèmes mineurs | 3 |
| Cosmétiques | 2 |
| Flows OK | 8 |

---

## Détail par flow

### 1. Page d'accueil — OK
- Chargement rapide (site déjà chaud au moment du test)
- Hero, searchbar, filtres temporels, filtres catégories : tous présents
- 19 événements affichés par défaut
- Design propre, aucune erreur visible

### 2. Recherche — OK (avec réserve)
- Rechercher "concert" retourne 1 résultat
- **Problème mineur :** la recherche conserve le filtre temporel actif précédent. Si "Ce week-end" est sélectionné, la recherche filtre dans ce sous-ensemble. Pas documenté, potentiellement contre-intuitif.

### 3. Filtre catégorie — OK
- Clic sur "Musique & soirées" → 4 événements affichés correctement
- Le bouton passe bien en état actif (chip-active)
- "Ce soir" → 3 events, "Ce week-end" → 6 events, "Cette semaine" → filtrage fonctionnel

### 4. Page event detail — OK
- Titre, date, heure, lieu, prix, organisateur : tous présents et corrects
- La carte Leaflet s'affiche avec le bon marker sur Nice
- Pas de vrai bouton "J'y vais" (RSVP) — seulement "Sauvegarder" et "Partager"
- Les images sont des placeholders emoji (imageUrl null en base)

### 5. RSVP — ABSENT
- Aucun bouton "J'y vais" sur la page event detail
- Le champ `rsvpCount` existe en base (ex: 11 pour la randonnée) mais il n'y a pas d'UI pour RSVP
- Fonctionnalité non implémentée côté frontend

### 6. Share — Silencieux
- Le bouton "Partager" existe
- En headless (et probablement sur navigateurs desktop non mobiles), l'API Web Share n'est pas supportée
- Aucun fallback visible (pas de copie URL, pas de toast, rien)
- **Problème mineur :** aucun feedback utilisateur sur desktop

### 7. Submit event (/submit) — CRASH CRITIQUE
- La page `/submit` affiche "Application error: a client-side exception has occurred"
- Page totalement blanche, formulaire inaccessible
- La route est accessible sans être connecté (pas de redirect vers login)
- L'API `/api/geocode` fonctionne correctement
- **Cause probable :** crash d'hydratation React ou bundle cassé en prod. Le code source semble correct, les imports sont valides. À investiguer avec les logs Render.

### 8. Login — CRITIQUE
- Tous les comptes échouent avec "Email ou mot de passe incorrect"
  - `user@ziben.fr / password123` — KO
  - `orga@ziben.fr / password123` — KO
  - `admin@ziben.fr / admin123` — KO
  - `test@ziben.fr / password123` — KO (compte inexistant)
- **Cause identifiée :** le hash du mot de passe utilise `NEXTAUTH_SECRET || "dev-secret"`. Si la variable `NEXTAUTH_SECRET` sur Render est différente de `"dev-secret"`, les hashes ne correspondent pas. Le seed a été lancé avec une valeur, la prod tourne avec une autre.
- **Impact :** 100% des fonctionnalités authentifiées sont inaccessibles (saved, organizer, etc.)

### 9. Events sauvegardés (/saved) — Redirect OK
- Redirect vers login quand non connecté : comportement correct
- Non testable sans login fonctionnel

### 10. Map (carte Leaflet sur event detail) — OK
- La carte Leaflet s'affiche correctement sur la page event detail
- Centrage correct sur Nice avec le marker positionné

### 11. Admin (/admin) — BLOQUANT (sécurité)
- `/admin` ne redirige pas vers login quand non connecté
- La page redirige silencieusement vers l'accueil sans message d'erreur
- **Comportement attendu :** redirect vers /login avec message "accès réservé"
- **Comportement actuel :** redirect vers / sans feedback

### 12. Map page globale (/map) — BLOQUANT
- La page `/map` s'affiche centrée sur **Paris** au lieu de **Nice**
- Aucun marker d'événements visible sur la carte
- Le hero dit "Nice" mais la carte pointe sur la région parisienne
- **Cause probable :** coordonnées par défaut mal configurées (Paris 48.87, 2.34 au lieu de Nice 43.70, 7.27)

### 13. Mobile (390x844 — iPhone) — Mineur
- Cards d'événements : OK en une colonne, lisibles
- Page event detail mobile : OK, Leaflet s'affiche, sidebar passe en dessous
- **Problème cosmétique :** le titre hero "Ce soir, tu fais quoi ?" se coupe en 3 lignes avec "?" seul sur la 3ème
- **Problème mineur :** boutons filtres temporels wrappent le texte ("Ce week-end" devient "Ce week- / end")

### 14. API directe — OK
- `GET /api/events?limit=5` → répond en JSON avec la structure correcte
- Total 19 events, pagination fonctionnelle (totalPages: 4)
- `GET /api/geocode?address=Nice` → répond correctement avec les coordonnées

---

## Bugs par priorité

### CRITIQUE (bloquant complet)

**BUG-01 : Login impossible — tous les comptes refusés**
- Route : `/login`
- Tous les comptes de démo affichés sur la page échouent
- Cause : mismatch de `NEXTAUTH_SECRET` entre le seed et l'environnement Render
- Fix : re-seeder la base avec `NEXTAUTH_SECRET` de prod, ou remettre `"dev-secret"` dans les variables Render (temporaire)
- Commande : `NEXTAUTH_SECRET=<valeur_render> npx tsx prisma/seed.ts`

**BUG-02 : Page /submit crashe (Application error)**
- Route : `/submit`
- La page est totalement inaccessible, aucun formulaire rendu
- Cause probable : erreur d'hydratation React ou module incompatible en prod
- Fix : consulter les logs Render (`render.com` → service → logs), chercher l'erreur JS client-side. Tester `npm run build` en local avec les env de prod.

**BUG-03 : Page /map centrée sur Paris au lieu de Nice**
- Route : `/map`
- La carte globale affiche Paris, pas Nice
- Aucun marker d'event visible
- Fix : trouver les coordonnées par défaut de la carte globale et les corriger (Nice : lat 43.7102, lng 7.2620)

### BLOQUANT (fonctionnalité cassée)

**BUG-04 : Route /admin sans protection auth**
- Route : `/admin`
- Accessible sans être connecté, redirige vers accueil sans message
- Fix : ajouter un middleware ou guard qui redirige vers `/login` si non authentifié ou non admin

**BUG-05 : Bouton "Partager" sans feedback desktop**
- Route : page event detail
- Clic sur Partager = rien de visible (Web Share API non supportée desktop)
- Fix : ajouter un fallback `navigator.clipboard.writeText(url)` avec toast "Lien copié !"

### MINEUR (dégradation UX)

**BUG-06 : Aucun bouton RSVP "J'y vais"**
- Le champ `rsvpCount` existe en base mais pas d'UI pour s'inscrire à un event
- Fix : implémenter le bouton RSVP (nécessite auth)

**BUG-07 : Recherche garde le filtre temporel actif**
- Une recherche textuelle devrait probablement reset le filtre temporel ou le comportement devrait être documenté
- Fix : documenter le comportement ou désactiver le filtre temporel lors d'une recherche

**BUG-08 : Filtres temporels wrappent le texte en mobile**
- "Ce week-end" s'affiche sur 2 lignes en 390px
- Fix : `whitespace-nowrap` sur les boutons ou réduire le padding

### COSMÉTIQUE

**BUG-09 : Titre hero cassé sur mobile**
- "Ce soir, tu fais quoi ?" → "Ce soir, tu fais quoi\n?" en mobile (390px)
- Fix : forcer `whitespace-nowrap` ou ajuster la taille de police responsive

**BUG-10 : Images événements manquantes (placeholders emoji)**
- Tous les events ont `imageUrl: null`, affichage en emoji placeholder
- Non bloquant pour le MVP mais à noter pour le polish

---

## Suggestions de fix rapides (par ordre de priorité)

1. **Login** : Vérifier `NEXTAUTH_SECRET` sur Render et re-seeder. Ou passer temporairement à `"dev-secret"` dans les env Render.

2. **/submit crash** : Aller dans les logs Render et copier l'erreur JS exacte. Probablement un `window is not defined` ou un import server-only dans un composant client.

3. **/map Paris** : Chercher la configuration du centre de carte dans la page `/map` et remplacer les coordonnées Paris par celles de Nice (43.7102, 7.2620), zoom 13.

4. **Admin sans guard** : Vérifier le middleware Next.js ou le composant de la page admin — ajouter `if (!user || user.role !== 'ADMIN') redirect('/login')`.

5. **Share fallback** : 2 lignes dans le handler du bouton Partager :
   ```ts
   if (!navigator.share) {
     navigator.clipboard.writeText(window.location.href);
     // afficher un toast
   }
   ```

6. **Mobile text wrap** : Ajouter `whitespace-nowrap` aux boutons filtres temporels.
