# Modèle financier — Ziben

## Sources de revenus

### 1. Boost d'événements (live)
Mise en avant d'un event en tête de liste.

| Offre | Prix | Durée |
|-------|------|-------|
| Starter | 5 € | 7 jours |
| Standard | 9 € | 14 jours |
| Pro | 15 € | 30 jours |

**Conversion réaliste :** 5-10% des organisateurs actifs/mois boostent au moins 1 event.

### 2. Abonnement organisateur (à créer)
Accès à des fonctionnalités premium (stats avancées, badge vérifié, priorité modération).

| Plan | Prix | Cible |
|------|------|-------|
| Free | 0 € | Testeur |
| Essentiel | 9 €/mois | Bar, asso |
| Pro | 29 €/mois | Salle, festival |

### 3. Partenariats locaux (à terme)
Badges "Partenaire officiel", mise en avant permanente, intégration agenda partenaire.
Tarif estimé : 50-200 €/mois selon visibilité.

---

## Projections de revenus

### Scénario conservateur (6 mois)

| Mois | Organisateurs actifs | Boosts vendus | Revenus boosts | Abonnements | Total |
|------|---------------------|---------------|----------------|-------------|-------|
| M1   | 5                   | 1             | 9 €            | 0           | 9 €   |
| M2   | 15                  | 3             | 27 €           | 0           | 27 €  |
| M3   | 30                  | 5             | 45 €           | 2 × 9 €     | 63 €  |
| M4   | 50                  | 8             | 72 €           | 5 × 9 €     | 117 € |
| M5   | 80                  | 12            | 108 €          | 10 × 9 €    | 198 € |
| M6   | 120                 | 20            | 180 €          | 15 × 9 €    | 315 € |

### Scénario optimiste (6 mois avec prospection active)

| Mois | Organisateurs | Boosts | Revenus boosts | Abonnements | Partenariats | Total |
|------|---------------|--------|----------------|-------------|--------------|-------|
| M1   | 10            | 3      | 27 €           | 0           | 0            | 27 €  |
| M2   | 30            | 8      | 72 €           | 3 × 9 €     | 0            | 99 €  |
| M3   | 60            | 15     | 135 €          | 8 × 9 €     | 1 × 50 €     | 257 € |
| M4   | 100           | 25     | 225 €          | 15 × 9 €    | 2 × 100 €    | 560 € |
| M5   | 150           | 40     | 360 €          | 25 × 9 €    | 3 × 100 €    | 885 € |
| M6   | 200           | 60     | 540 €          | 40 × 9 €    | 5 × 100 €    | 1 400 € |

---

## Coûts mensuels actuels

| Poste | Coût/mois | Notes |
|-------|-----------|-------|
| Render.com (free) | 0 € | Limites : cold start, 512 MB RAM |
| Neon (free) | 0 € | 0.5 GB stockage, 191h compute/mois |
| Stripe | ~3% × CA | Frais de transaction (1.5% + 0.25€ CB FR) |
| Domaine ziben.fr | ~1 €/mois | À acheter (~12 €/an) |
| **Total fixe** | **~1 €/mois** | Hors Stripe |

### Coûts si croissance

| Étape | Trigger | Coût additionnel |
|-------|---------|------------------|
| Render Starter | > 1000 req/jour, cold start inacceptable | +7 $/mois |
| Neon Pro | > 0.5 GB data | +19 $/mois |
| Email (Resend) | Emails transactionnels | 0 € jusqu'à 3000 emails/mois |

---

## Indicateurs clés à suivre (KPIs)

| Métrique | Comment mesurer | Objectif M3 | Objectif M6 |
|----------|-----------------|-------------|-------------|
| Events publiés (total) | DB count | 100 | 500 |
| Organisateurs inscrits | DB count | 20 | 100 |
| Vues/mois | viewCount sum | 500 | 5 000 |
| RSVP/mois | rsvpCount sum | 100 | 1 000 |
| CA mensuel | Stripe dashboard | 50 € | 500 € |
| Taux boost | boosts/organisateurs | 5% | 15% |
| Push subscribers | PushSubscription count | 50 | 500 |

---

## Seuils importants

| Seuil | Impact |
|-------|--------|
| **36 800 €/an de CA** | Seuil franchise TVA — au-delà, facturer 20% TVA |
| **72 600 €/an de CA** | Seuil micro-BNC — au-delà, passer en régime réel |
| **85 800 €/an de CA** | Seuil micro-BIC — same |

Pour la phase actuelle, **aucun seuil n'est à risque d'être atteint**. Pas de TVA, comptabilité ultra-simple.

---

## Optimisation des revenus

### Actions à fort ROI
1. **Email prospection** (templates dans `docs/email-templates.md`) : 1h/semaine, coût = 0
2. **Google My Business** pour Ziben : améliore le référencement local gratuit
3. **Instagram Nice** : créer compte, poster les events phares, croissance organique
4. **Partenariat OT Nice** : intégration agenda officiel → crédibilité + trafic

### Pricing psychology
- 5€ pour le premier test → réduire la friction
- 9€ (standard) → meilleur ratio valeur/prix, à pousser en priorité
- 15€ → ancre haute, rend le 9€ attractif

### Funnel organisateur
```
Scraper détecte un event existant
  → Event apparaît sur Ziben (APPROVED auto)
  → L'organisateur découvre son event sur Ziben
  → Email de prospection : "Votre event est sur Ziben, créez un compte"
  → Compte organisateur créé
  → Upsell boost
```

---

## Trésorerie (template mensuel)

```
Mois : [MOIS ANNÉE]

ENTRÉES
  Boosts vendus : __ × 5€ + __ × 9€ + __ × 15€ = ___€
  Abonnements : __ × 9€ + __ × 29€ = ___€
  Partenariats : ___€
  TOTAL ENTRÉES : ___€

SORTIES
  Render : 0€ / ___€
  Neon : 0€ / ___€
  Domaine : ___€
  Frais Stripe : ___€ (≈ 3% des entrées)
  Autres : ___€
  TOTAL SORTIES : ___€

RÉSULTAT NET : ___€
CHARGES SOCIALES (22%) : ___€
NET APRÈS CHARGES : ___€
```
