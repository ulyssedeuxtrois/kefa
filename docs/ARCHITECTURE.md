# Architecture technique — Ziben

## Vue d'ensemble

Ziben est une app Next.js full-stack déployée sur Render. Tout est dans un seul repo :
- Le front (React components)
- Le back (API routes Next.js)
- Les scripts (scraper, seeds)

```
Browser/PWA
    │
    ▼
Next.js 14 App Router (Render.com)
    │
    ├── Pages React (client components)
    ├── API Routes (server-side)
    │       ├── Prisma ORM
    │       │       └── PostgreSQL (Neon)
    │       ├── Stripe SDK
    │       └── Web Push (vapid-keys)
    │
GitHub Actions (cron scraper) ──→ /api/events/import
```

---

## Flux principaux

### 1. Découverte d'événement

```
/ (homepage)
  └── fetch /api/events?filters...
        └── Prisma: Event findMany (status=APPROVED, orderBy: boosted desc, date asc)
              └── JSON → EventList → EventCard
```

### 2. Soumission d'un event (public)

```
/submit (formulaire)
  └── POST /api/events { submitterName, submitterEmail, title, ... }
        ├── prisma.event.create (status=PENDING)
        └── notifyNewEvent() → Discord webhook (best-effort)

/admin (panel)
  └── GET /api/admin/events (events PENDING)
        └── PUT /api/admin/events { id, status: "APPROVED"|"REJECTED" }
```

### 3. Scraping automatique

```
GitHub Actions cron (toutes 6h)
  └── node scripts/scraper.mjs
        ├── scrapeEventbrite()  → Eventbrite destination API
        ├── scrapeNiceFr()      → OpenAgenda API (agendas/92168406)
        └── scrapeMeetup()      → Meetup GraphQL API
              │
              ▼
        dedupe() (titre+date)
              │
              ▼
        POST /api/events/import
          header: x-import-secret: $ZIBEN_IMPORT_SECRET
              └── prisma.event.create (status=APPROVED, city=nice)
```

### 4. Boost Stripe

```
/events/[id] (organisateur connecté)
  └── Click "Mettre en avant (7j / 14j / 30j)"
        └── POST /api/stripe/checkout { eventId, days }
              └── stripe.checkout.sessions.create
                    └── redirect → Stripe Checkout page
                          └── success → /events/[id]?boosted=1
                                └── webhook POST /api/stripe/webhook
                                      └── prisma.event.update { boosted: true, boostedUntil }
                                            └── notifyBoost() → Discord
```

### 5. Notifications push

```
/  (PushPrompt component)
  └── serviceWorker.pushManager.subscribe (VAPID public key)
        └── POST /api/push/subscribe { endpoint, p256dh, auth }
              └── prisma.pushSubscription.create

/admin (panel)
  └── POST /api/push/send { title, body, url }
        └── webpush.sendNotification() → tous les endpoints
```

---

## Modèle de données (résumé)

```
User
  ├── role: USER | ORGANIZER | ADMIN (string, pas enum)
  ├── events[] → Event (relation OrganizerEvents)
  └── savedEvents[] → SavedEvent

Event
  ├── status: PENDING | APPROVED | REJECTED
  ├── city: "nice" (extensible)
  ├── boosted: bool + boostedUntil: DateTime?
  ├── organizerId? → User (null si soumission publique)
  ├── submitterName/Email: String? (soumissions sans compte)
  └── rsvps[] → Rsvp

Category (seeded, statique)
  cat1=Musique/Soirées, cat2=Arts/Spectacles, cat3=Culture
  cat4=Conférences/Ateliers, cat5=Vie locale, cat6=Sport
  cat7=Food, cat8=Famille, cat9=Nature, cat10=Jeux/Geek

Rsvp
  └── sessionId: String (généré côté client, localStorage)

PushSubscription
  └── endpoint unique par appareil
```

---

## Authentification

Système custom (pas NextAuth, pas JWT).

1. `POST /api/auth/login` → vérifie email + SHA256(password+secret) → retourne `{ id, email, name, role }`
2. Le client stocke l'objet user dans `localStorage` via `AuthContext`
3. `useAuth()` lit le localStorage au mount
4. Pas de cookie httpOnly → **vulnérabilité XSS connue**, acceptable pour le MVP

---

## Déploiement

- **Render free tier** : 1 instance, sleep après 15min d'inactivité, cold start 30-60s
- **Deploy** : automatique sur push `master` (Render webhook GitHub)
- **Build command** : `npm run build` (next build)
- **Start command** : `npm start`
- **Node** : 20.x

### Temps de deploy typique

| Étape | Durée |
|-------|-------|
| Checkout + install | 2-3 min |
| next build | 3-5 min |
| Swap instance | 1-2 min |
| **Total** | **6-10 min** |

---

## Points d'attention

### Performance
- Pas de cache Redis — chaque requête tape Neon
- Neon serverless : cold start ~200ms si pas de requête depuis 5min
- EventMap (Leaflet) chargé en dynamic import (évite SSR crash)

### Limites actuelles
- Admin sans authentification serveur (route non protégée côté serveur)
- Sessions stockées localStorage (pas httpOnly)
- Pas d'upload d'images (imageUrl = null pour la majorité des events)
- Pas de pagination côté UI (limit=20 par défaut)

### Scalabilité (si besoin un jour)
- Passer de Render free à Render paid (ou Vercel)
- Neon scale automatiquement
- Ajouter Redis pour cache homepage (Upstash gratuit)
- CDN pour images (Cloudinary ou Vercel Blob)
