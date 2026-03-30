# Sécurité — Ziben

## État actuel : audit MVP

---

## Ce qui est sécurisé ✅

### Authentification
- Mots de passe hashés SHA-256 + sel (`NEXTAUTH_SECRET`)
- Pas de mot de passe en clair en base ni dans les logs
- Pas de secret dans le code source (tout en env vars)

### API
- Import scraper protégé par `x-import-secret` header (`SCRAPER_SECRET`)
- Stripe webhook validé par signature (`stripe.webhooks.constructEvent`)
- `.gitignore` couvre `.env`, `.env.local`

### Données bancaires
- Stripe gère tout — Ziben ne touche jamais les données de carte
- Pas de stockage de données de paiement en local

### Dépendances
- `npm audit` à lancer régulièrement
- Prisma prévient les injections SQL (paramètres bindés)
- Next.js échappe automatiquement les contenus HTML (XSS)

---

## Vulnérabilités connues et acceptées (MVP) ⚠️

### 1. Sessions dans localStorage (CRITIQUE à terme)
- **Problème** : token stocké en localStorage accessible par JS → vulnérable aux attaques XSS si une lib tierce est compromise
- **Impact** : vol de session utilisateur
- **Mitigation MVP** : les utilisateurs ne stockent pas de données sensibles (pas de CB, pas d'adresse)
- **Fix futur** : migrer vers httpOnly cookie avec `NextResponse.cookies.set()`

### 2. Admin sans auth serveur
- **Problème** : `/admin` vérifie le rôle côté client uniquement. Le endpoint `/api/admin/events` ne vérifie pas l'identité
- **Impact** : n'importe qui qui connaît l'URL peut approuver/rejeter des events
- **Mitigation** : URL non publique, obscurité
- **Fix futur** : ajouter vérification du token en header sur tous les endpoints `/api/admin/*`

### 3. Rate limiting absent
- **Problème** : pas de rate limiting sur `/api/auth/login` → brute force possible
- **Impact** : attaque par dictionnaire sur les comptes
- **Fix futur** : ajouter `next-rate-limit` ou middleware Upstash Ratelimit

### 4. CORS non configuré
- **Problème** : les API routes acceptent des requêtes de n'importe quelle origine
- **Impact** : faible (pas de tokens CSRF car pas de cookies)
- **Fix futur** : configurer `Access-Control-Allow-Origin` dans les headers Next.js

### 5. Validation des inputs côté serveur
- **Problème** : peu de validation stricte sur les champs (length, type) côté API
- **Impact** : possibilité d'injecter des strings très longues
- **Mitigation** : Prisma coupe aux limites DB, `.slice(0, 200)` dans le scraper
- **Fix futur** : ajouter Zod validation sur les routes critiques

---

## Checklist sécurité avant lancement public

### Immédiat (avant d'avoir des utilisateurs réels)
- [ ] Ajouter protection serveur sur `/api/admin/*` (vérifier rôle via token)
- [ ] Ajouter rate limiting sur `/api/auth/login` (max 10 tentatives/min)
- [ ] Vérifier que `SCRAPER_SECRET` est fort (au moins 32 chars aléatoires)
- [ ] Vérifier que `NEXTAUTH_SECRET` est fort

### Avant d'avoir des données sensibles
- [ ] Migrer sessions vers httpOnly cookies
- [ ] Ajouter Content-Security-Policy header
- [ ] Activer HSTS (géré par Render automatiquement sur HTTPS)

### Avant de passer en payant
- [ ] Activer Stripe Radar (détection fraude)
- [ ] Limiter les boosts à 1 actif par event
- [ ] Vérifier que le webhook Stripe rejette bien les signatures invalides (déjà en place)

---

## Variables d'environnement — état

| Var | Niveau de sensibilité | En prod ? | Notes |
|-----|----------------------|-----------|-------|
| `DATABASE_URL` | CRITIQUE | Render | Accès full DB |
| `DIRECT_URL` | CRITIQUE | Render | Accès full DB |
| `NEXTAUTH_SECRET` | HAUTE | Render | Sel passwords |
| `SCRAPER_SECRET` | HAUTE | Render + GitHub | Auth import API |
| `STRIPE_SECRET_KEY` | HAUTE | À ajouter | Paiements |
| `STRIPE_WEBHOOK_SECRET` | HAUTE | À ajouter | Validation webhook |
| `VAPID_PRIVATE_KEY` | MOYENNE | Render | Push notifs |
| `DISCORD_WEBHOOK_URL` | FAIBLE | Render (optionnel) | Notifications admin |

---

## En cas d'incident

1. **Compromission DB** : changer `DATABASE_URL` + `DIRECT_URL` dans Render → invalide toutes les connexions
2. **Compromission Stripe** : révoquer la clé dans le dashboard Stripe → créer une nouvelle
3. **Compromission GitHub** : révoquer le token GitHub Actions → recréer les secrets
4. **Spam d'events** : passer tous les events à `PENDING` en DB : `UPDATE "Event" SET status='PENDING' WHERE status='APPROVED' AND "createdAt" > 'now - 1h'`

Contact sécurité : contact@ziben.fr
