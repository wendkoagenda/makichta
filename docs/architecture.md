# Architecture cible (v1)

## Vision

Construire une application financière modulaire, évolutive et simple d'usage, avec une base solide pour l'ajout futur de synchronisation bancaire, export et multi-comptes.

## Stack retenue

- Framework: `Next.js` (App Router + TypeScript)
- UI: `shadcn/ui`
- État global: `Redux Toolkit`
- API: Route Handlers Next.js (v1), extraction possible vers service dédié ensuite
- Base de données: SQLite + Prisma ORM

## Principes de conception

- Modules métier découplés: revenus, dépenses, épargne, investissement, planification, paramétrage
- Flux clair: revenus -> répartition -> exécution dépenses -> indicateurs
- Composants UI réutilisables et orientés domaine
- Validation stricte des entrées côté client et serveur
- Terminologie simple et pédagogique dans toute l'interface
- Accès rapide aux informations clés (dashboard = point d'entrée principal)

## Concepts métier clés

### Sources de revenus (paramétrables)

L'utilisateur crée ses propres types de sources de revenus. Chaque source a :

- un libellé personnalisable (ex. : "Salaire CDI", "Freelance design", "Allocation CAF")
- une fréquence : récurrente (mensuelle, hebdo, etc.) ou ponctuelle
- les revenus saisis sont rattachés à une source

### Répartition automatique

Quand un revenu est enregistré, il est automatiquement découpé en enveloppes (postes) selon des pourcentages définis par l'utilisateur (ex. : 50% charges fixes, 20% épargne, 15% loisirs, 15% investissement). Les pourcentages sont modifiables à tout moment avec recalcul immédiat.

### Budget par catégorie

Chaque catégorie de dépenses (fixe ou variable) a un budget mensuel prévu. Le suivi compare ce budget au réel pour détecter les dépassements.

### Épargne à objectifs

Les objectifs d'épargne (montant cible, échéance, priorité) sont alimentés automatiquement par la part "épargne" de la répartition. La progression affiche le pourcentage atteint, le montant épargné et le restant.

### Investissement lié aux revenus

Le poste investissement issu de la répartition alimente un suivi par type (actions, crypto, immobilier, autres) avec historique et vision d'allocation globale.

### Amortissement linéaire

Un bien enregistré (valeur d'achat, durée, date d'acquisition) génère un calcul automatique mensuel et annuel avec valeur résiduelle mise à jour.

## Organisation des dossiers

Structure par **models** : chaque modèle métier est un mini-module autonome contenant ses composants, hooks, services, utils et types. Les composants sont indépendants et réutilisables dans toute l'application.

```txt
src/
  models/
    revenues/
      components/         # revenue-form.tsx, revenue-list.tsx, create-revenue-dialog.tsx
      hooks/              # use-revenues.ts, use-revenue-source.ts
      utils/              # calculate-total.ts, format-revenue.ts
      services/           # get-revenues.ts, create-revenue.ts, delete-revenue.ts
      types/              # revenue.ts, revenue-source.ts
    expenses/
      components/
      hooks/
      utils/
      services/
      types/
    allocations/
    savings/
    investments/
    planning/
    wishlist/
    depreciation/
    settings/
  components/             # composants partagés (sidebar.tsx, date-picker.tsx, etc.)
  hooks/                  # hooks globaux (use-auth.ts, use-theme.ts)
  utils/                  # utilitaires globaux (format-currency.ts, format-date.ts)
  services/               # services globaux (auth.ts, config.ts)
  types/                  # types globaux (user.ts, api-response.ts)
  store/
    index.ts
    slices/               # revenues-slice.ts, expenses-slice.ts, etc.
  lib/
    db/
    constants/            # devises, périodes, catégories par défaut
  app/                    # routage Next.js uniquement
    (auth)/
    (dashboard)/
    api/
```

Nomenclature des fichiers : **kebab-case, anglais**. Voir [docs/coding-conventions.md](docs/coding-conventions.md).

## Gestion d'état (Redux Toolkit)

- Un store global unique
- Slices par module métier : revenues, allocations, expenses, savings, investments, planning, wishlist, depreciation, settings
- Selectors mémorisés pour le dashboard (taux d'épargne, reste à vivre, écart budget)
- Async via `createAsyncThunk` en v1
- Possibilité de migration partielle vers `RTK Query` en v2

## Sécurité et données

- Authentification utilisateur obligatoire
- Cloisonnement des données par utilisateur (`userId` sur toutes les entités métier)
- Journal minimal des actions critiques (création/suppression de données financières)
- Sauvegarde et restauration des données utilisateur

## Paramétrage utilisateur

- Devise (EUR par défaut)
- Période de référence (mensuelle par défaut)
- Pourcentages de répartition modifiables
- Activation/désactivation de modules : investissement, amortissement, wishlist

## Performance

- Calculs agrégés mensuels optimisés en lecture
- Pagination sur historiques longs
- Pré-calcul d'indicateurs si le volume augmente

## Évolutions prévues (hors MVP)

- Notifications / rappels
- Synchronisation bancaire
- Export CSV/PDF
- Multi-comptes
- Application mobile native
