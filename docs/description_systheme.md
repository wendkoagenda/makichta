# Description du système Ma Kichta

Document de référence pour préparer un bon paramétrage (configuration, déploiement, sécurisation).

---

## 1. Vue d’ensemble

- **Type** : application web de gestion budgétaire et financière personnelle (revenus, dépenses, épargne, investissements, actifs/passifs, wishlist, planification).
- **Stack** : Next.js 14 (App Router), React 18, TypeScript, Prisma 5 (PostgreSQL), NextAuth 4 (JWT + credentials), Redux Toolkit, Tailwind CSS 4, Radix UI, Recharts.
- **Répertoire racine de l’app** : `makichta/` (à la racine du repo : `main/makichta/makichta/`).
- **Scripts** : `npm run dev` (dev), `npm run build` / `npm start` (prod), `npm run db:migrate` (migrations), `npm run db:push` (sync schema sans migration), `postinstall` exécute `prisma generate`.

---

## 2. Authentification

- **NextAuth** avec **CredentialsProvider** (email + mot de passe).
- **Stratégie** : JWT (pas de session en base pour la session elle-même).
- **Secret** : `NEXTAUTH_SECRET` (obligatoire en prod, min 32 caractères).
- **URL** : `NEXTAUTH_URL` (ex. `http://localhost:3000` en dev, URL publique en prod).
- **Flux** : formulaire login → `authorize` vérifie email/mot de passe via Prisma + `bcrypt.compare` → JWT contient `id`, `email` → callback `session` expose `session.user.id` et `session.user.email` au client et aux routes API.
- **Pages** : login (`/login`), inscription (`/register`). Page signIn personnalisée dans `authOptions.pages.signIn`.
- **Protection dashboard** : `dashboard/layout.tsx` appelle `getServerSession(authOptions)` ; si pas de session → `redirect("/login")`.
- **API** : chaque route protégée fait `getServerSession(authOptions)` et renvoie 401 si `!session?.user?.id`.

---

## 3. Base de données (Prisma + PostgreSQL)

- **Provider** : PostgreSQL.
- **URL** : fournie par `DATABASE_URL` ou construite à partir de `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` (voir `src/lib/db/config.ts`). Si `DATABASE_URL` est défini, il est utilisé tel quel.
- **Client** : singleton Prisma en dev (`globalThis`) pour éviter trop d’instances lors du hot reload.

### Modèles principaux et relations

- **User** : id (cuid), email (unique), passwordHash, name, currency (défaut "USDT"), periodReference (défaut "MONTHLY"), createdAt, updatedAt. Toutes les entités métier sont liées à `User` (userId) avec `onDelete: Cascade` sauf mention contraire.

- **Month** : id, label, year, month (unique [year, month]). Référencé par les revenus, dépenses, allocations, catégories de dépenses, règles d’allocation, contributions d’épargne. Pas de lien direct User → Month (les mois sont des référentiels partagés ou créés par le système).

- **RevenueSource** : User → RevenueSource (1-N). Champs : label, frequency, recurrenceInterval.

- **Revenue** : User, RevenueSource, Month. amount, date, description. Lié aux Allocation.

- **AllocationRule** : User, Month. label, percentage. Lié à Allocation et ExpenseCategory (règles de répartition).

- **Allocation** : Revenue, AllocationRule, Month. amount (répartition d’un revenu selon les règles).

- **ExpenseCategory** : User, Month. label, type, monthlyBudget, budgetPercent. Lié aux Expense et AllocationRule.

- **Expense** : User, ExpenseCategory, Month. amount, date, description.

- **SavingProject** : User. label, targetAmount?, deadline?. 1-N vers SavingGoal.

- **SavingGoal** : User, SavingProject? (optionnel). label, targetAmount, currentAmount, deadline?, priority. Lié à SavingContribution et WishlistItem.

- **SavingContribution** : SavingGoal, Month. amount, date, isAutomatic.

- **Investment** : User. type, amount, date, description.

- **PlannedExpense** : User. label, estimatedAmount, dueDate, isRecurring, recurrenceInterval?, isDone.

- **WishlistItem** : User, SavingGoal? (optionnel). label, estimatedCost, priority, url?.

- **Asset** : User. label, purchaseValue, depreciationDurationMonths, acquisitionDate (actifs / biens pour amortissement).

- **Liability** : User. label, amount, date, note? (passifs / dettes).

Toutes les clés étrangères sont indexées (userId, etc.) ; les suppressions User propagent en cascade sur les entités liées.

---

## 4. Variables d’environnement et configuration

- **Obligatoires (prod)** :
  - `DATABASE_URL` : chaîne de connexion PostgreSQL complète (ou alors PG\_\* utilisés par `config.ts`).
  - `NEXTAUTH_SECRET` : secret pour signer les JWT (min 32 caractères).
  - `NEXTAUTH_URL` : URL publique de l’application (ex. `https://makichta.example.com`).

- **Optionnelles (si pas de DATABASE_URL)** : `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` (utilisées dans `src/lib/db/config.ts` pour construire l’URL).

- **Fichiers** : `.env` à la racine du projet `makichta/`, `.env.example` en référence (ne pas commiter de vrais secrets).

---

## 5. API (Next.js App Router)

- **Emplacement** : `src/app/api/`.
- **Pattern** : routes par ressource (ex. `api/liabilities/route.ts` pour GET/POST, `api/liabilities/[id]/route.ts` pour GET/PATCH/DELETE selon les cas). Session vérifiée via `getServerSession(authOptions)` ; `session.user.id` utilisé pour filtrer les données par utilisateur.
- **Réponses** : JSON. Erreurs : 400 (validation), 401 (non authentifié), 404 (ressource introuvable), 500 (erreur serveur).
- **Principales routes** :
  - Auth : `api/auth/[...nextauth]`, `api/auth/register`.
  - Revenus : `revenue-sources`, `revenues`, `revenue-sources/[id]`, `revenues/[id]`.
  - Mois : `months`, `months/duplicate`.
  - Répartition : `allocation-rules`, `allocation-rules/[id]`, `allocation-rules/seed`.
  - Dépenses : `expense-categories`, `expense-categories/[id]`, `expense-categories/seed`, `expenses`, `expenses/[id]`, `expenses/summary`.
  - Épargne : `saving-projects`, `saving-projects/[id]`, `saving-goals`, `saving-goals/[id]`, `saving-goals/[id]/contributions`.
  - Investissements : `investments`, `investments/[id]`, `investments/summary`.
  - Planification : `planned-expenses`, `planned-expenses/[id]`.
  - Wishlist : `wishlist`, `wishlist/[id]`, `wishlist/convert`.
  - Actifs / passifs : `assets`, `assets/[id]`, `liabilities`, `liabilities/[id]`.
  - Dashboard : `dashboard/monthly`, `dashboard/annual`.
  - Paramètres / devise : `exchange-rates` (GET, pas d’auth), settings gérés via User en base (currency, periodReference).

---

## 6. Frontend (structure et état)

- **Layout** : `src/app/layout.tsx` (global), `src/app/(auth)/` (login, register), `src/app/dashboard/layout.tsx` (sidebar + zone principale, protégé).
- **Pages dashboard** : `dashboard/page.tsx` (tableau de bord), puis une page par section (revenues, revenue-history, allocations, expenses, expense-categories, savings, investments, planning, wishlist, depreciation “Actifs & passifs”, settings).
- **Composants UI** : `src/components/ui/` (Radix + Tailwind : Button, Card, Dialog, Input, Label, Select, etc.), `src/components/sidebar.tsx` (navigation + devise affichée + déconnexion).
- **State global** : Redux Toolkit (`src/store/`). Slices : revenues, allocations, expenses, savings, investments, planning, wishlist, depreciation (assets), settings. Utilisé pour une partie des listes et du cache côté client ; certaines fonctionnalités utilisent des hooks locaux (useState + fetch) sans Redux.
- **Modèles métier** : sous `src/models/` par domaine (ex. `saving-goals`, `saving-projects`, `assets`, `liabilities`, `settings`). Chaque domaine peut contenir : `types/`, `services/` (appels Prisma ou réutilisation des services côté serveur), `hooks/` (ex. useSavingGoals, useLiabilities, useAssets, useSettings), `components/` (formulaires, listes, cartes). Les pages dashboard importent ces composants et hooks.
- **Devise** : la devise d’affichage est celle de l’utilisateur (User.currency). Le hook `useCurrency` / modèle settings fournit la conversion et le formatage via les taux de change (API `exchange-rates`).

---

## 7. Devise et taux de change

- **Devises gérées** : USDT, USD, EUR, XOF (voir `AVAILABLE_CURRENCIES` dans le modèle settings).
- **Source des taux** : `src/lib/currency/exchange-rates.ts` appelle une API externe (ex. exchangerate-api.com) en base USD ; cache en mémoire (TTL 1 h). En cas d’échec, taux de repli codés en dur (USDT/USD 1, EUR, XOF).
- **API** : `GET /api/exchange-rates` renvoie un objet de taux (pas d’authentification). Utilisée par le front pour convertir et afficher les montants dans la devise de l’utilisateur.

---

## 8. Points utiles pour un bon paramétrage

- **Sécurité** : en production, définir un `NEXTAUTH_SECRET` fort et unique ; ne jamais commiter `.env` ; utiliser `NEXTAUTH_URL` en HTTPS.
- **Base de données** : appliquer les migrations (`prisma migrate deploy`) après déploiement ; en dev, après ajout d’un modèle, exécuter `prisma generate` (idéalement avec le serveur arrêté si EPERM sur le client).
- **Performance / cache** : taux de change en cache 1 h ; adapter si besoin (TTL, autre API, cache distribué en multi-instances).
- **Logs** : certaines routes API loguent les erreurs en console (ex. POST liabilities). À aligner avec la stratégie de logging (fichier, service, niveau).
- **CORS / domaine** : NextAuth et les cookies de session dépendent du domaine ; configurer correctement `NEXTAUTH_URL` et les options de cookies si domaine ou sous-domaine différent.
- **Inscription** : route `api/auth/register` à sécuriser (rate limit, validation, politique de mot de passe) selon le contexte.
- **Backup** : prévoir sauvegardes régulières de la base PostgreSQL (données utilisateurs et paramétrage).

---

_Document généré pour faciliter la préparation d’un paramétrage (déploiement, sécurité, env, base de données) par un outil ou une IA._
