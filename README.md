# Ma Kichta

Application de gestion des finances personnelles construite avec `Next.js`, `shadcn/ui` et `Redux Toolkit`.

## Objectif

Fournir une vision claire des revenus, dépenses, épargne et investissements avec une logique orientée objectifs.

## Stack technique

- `Next.js` (App Router, TypeScript)
- `shadcn/ui` (UI components)
- `Redux Toolkit` (state management global)
- Base de données: SQLite + Prisma ORM

## Périmètre MVP (phase 1)

- Authentification utilisateur
- Gestion des revenus
- Catégories de dépenses (fixes / variables)
- Saisie et suivi des dépenses mensuelles
- Répartition automatique par pourcentages
- Tableau de bord mensuel simple

## Structure initiale

- `docs/architecture.md` : choix d'architecture et structure des dossiers
- `docs/coding-conventions.md` : conventions de nommage et règles de code
- `docs/database-schema.md` : diagramme UML et description de la base de données
- `docs/backlog-mvp.md` : backlog priorisé du MVP
- `.env.example` : variables d'environnement de départ
- `Cahier des charges.txt` : besoin fonctionnel détaillé

## Lancement (à faire après initialisation Next.js)

```bash
npm install
npm run dev
```

## Notes

Ce dépôt démarre avec la documentation de cadrage. Le scaffolding applicatif Next.js sera ajouté dans le sprint de setup.
