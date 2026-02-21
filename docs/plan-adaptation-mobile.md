# Diagnostic et plan d'adaptation mobile – Ma Kichta

## 1. Déjà en place

- **Navigation mobile** : bottom bar (Dépenses, Revenus, Tableau de bord central, Épargne, Plus) avec indicateur actif et tiroir « Plus ».
- **Sidebar** : masquée sur mobile (`hidden md:flex`).
- **Main** : `pb-20 md:pb-8` pour éviter que le contenu passe sous la barre.
- **Cartes épargne** : objectifs et projets avec grille responsive (1/2/3 colonnes), en-têtes qui passent en colonne sur petit écran, `min-w-0` et `break-words` pour éviter les débordements.

---

## 2. Diagnostic par zone

### 2.1 Layout global dashboard

| Élément | Fichier | Constat | Priorité |
|--------|---------|--------|----------|
| Padding main | [dashboard/layout.tsx](makichta/src/app/dashboard/layout.tsx) | `p-8` partout : trop sur petit écran, réduit la zone utile | Moyenne |
| Safe area | idem | Pas de `pb-safe` / padding pour encoche ou barre système | Basse |

**Recommandation** : `p-4 sm:p-6 md:p-8` (ou `px-4 py-6 md:p-8`) pour réduire le padding sur mobile.

---

### 2.2 Tableau de bord (page d'accueil)

| Élément | Fichier | Constat | Priorité |
|--------|---------|--------|----------|
| Grille 5 cartes (Revenus, Dépenses, Épargne x2, Invest.) | [dashboard/page.tsx](makichta/src/app/dashboard/page.tsx) | `grid gap-4 md:grid-cols-2 lg:grid-cols-5` : sur mobile 1 colonne OK. Passer à 2 cols dès `sm` possible pour gagner de la place | Basse |
| En-têtes des cartes | idem | `flex flex-row` : titre + icône, peut être serré si titre long | Basse |
| Montants en `text-2xl` | idem | Peut rester en 2xl ; optionnel : `text-xl sm:text-2xl` sur mobile | Basse |
| Graphique objectifs (BarChart vertical) | idem | `margin={{ left: 80 }}`, `YAxis width={70}` : libellés longs tronqués sur petite largeur | Haute |
| Grille « Indicateurs clés » + « Répartition dépenses » | idem | `lg:grid-cols-2` : sur mobile 1 colonne. OK | - |
| Liste « Alloué vs dépensé » | idem | Déjà `flex-wrap`, bordures, texte. OK | - |
| Vue annuelle (BarChart, LineChart) | idem | `h-[260px]`, `h-[200px]` avec ResponsiveContainer : OK. Réduire légèrement `tick={{ fontSize: 11 }}` sur mobile si besoin | Basse |

**Recommandation prioritaire** : Sur mobile, pour le BarChart des objectifs d’épargne : réduire `margin.left` et `YAxis width`, ou raccourcir les libellés (ex. troncature + tooltip). Éviter débordement horizontal.

---

### 2.3 Pages avec en-tête (titre + actions)

| Page | Fichier | Constat | Priorité |
|------|---------|--------|----------|
| Revenus | [revenues/page.tsx](makichta/src/app/dashboard/revenues/page.tsx) | Déjà `flex-col gap-4 sm:flex-row`. MonthPicker `triggerClassName="w-[180px]"` : sur mobile passer en `w-full sm:w-[180px]` | Moyenne |
| Historique revenus | [revenue-history/page.tsx](makichta/src/app/dashboard/revenue-history/page.tsx) | Même logique en-tête. Vérifier le contenu (listes, filtres) | Basse |
| Dépenses, Répartition, Épargne, etc. | diverses | Titre `text-3xl` : optionnel `text-2xl sm:text-3xl` sur mobile | Basse |

**Recommandation** : MonthPicker (et autres sélecteurs de mois en largeur fixe) : `w-full sm:w-[180px]` sur les pages Revenus / Répartition / etc.

---

### 2.4 Listes (lignes avec libellé + montant + boutons)

| Composant | Fichier | Constat | Priorité |
|-----------|---------|--------|----------|
| Règles de répartition | [allocation-rule-list.tsx](makichta/src/models/allocation-rules/components/allocation-rule-list.tsx) | Ligne : `flex items-center justify-between`. À gauche : label + texte (catégories, objectif) qui peut être long. À droite : montant + 2 boutons. Risque de compression sur mobile | Haute |
| Dépenses du mois | [expense-list.tsx](makichta/src/models/expenses/components/expense-list.tsx) | Même schéma : gauche catégorie + date/description, droite montant + 2 boutons | Haute |
| En-tête de carte (titre + bouton) | allocation-rule-list, expense-list | `flex flex-row items-center justify-between` : sur très petit écran, passer en colonne (titre au-dessus, boutons en dessous) | Moyenne |

**Recommandation** :
- Ajouter `min-w-0` sur le bloc texte (gauche) et `flex-wrap` ou `flex-col gap-2 sm:flex-row sm:items-center` sur la ligne pour que sur mobile le contenu et les boutons ne se marchent pas dessus.
- Option : sur mobile, afficher une seule ligne résumée (libellé + montant) et détailler au clic (ou garder les 2 boutons en taille réduite avec zones de touch suffisantes).

---

### 2.5 Formulaires et dialogs

| Élément | Constat | Priorité |
|--------|--------|----------|
| DialogContent | [dialog.tsx](makichta/src/components/ui/dialog.tsx) | `max-w-lg`, centré. Sur mobile prend presque toute la largeur. Ajouter `max-h-[90vh] overflow-y-auto` sur le contenu pour formulaires longs | Moyenne |
| Champs de formulaire | Forms (saving-goal, allocation-rule, expense, etc.) | Inputs en pleine largeur, labels au-dessus. OK | - |
| BottomNav tiroir « Plus » | [bottom-nav.tsx](makichta/src/components/bottom-nav.tsx) | Déjà en style bottom sheet (`bottom-0 top-auto`). OK | - |

**Recommandation** : S’assurer que les Dialog avec formulaires longs ont un contenu scrollable (déjà souvent le cas dans les CardContent). Si un dialog dépasse l’écran, appliquer `max-h-[90vh] overflow-y-auto` sur la zone de contenu (ou via une variante du Dialog).

---

### 2.6 Composants métier à vérifier

| Composant | Fichier (approx.) | À vérifier | Priorité |
|-----------|-------------------|------------|----------|
| RevenueSourceList / RevenueListCard | revenues/components | Grille ou liste des sources ; filtres (mois, source) en ligne. Sur mobile : filtres en colonne ou full width | Moyenne |
| ExpenseBudgetSummary | expenses/components | En-tête carte + select mois. Liste catégories : pas de débordement horizontal | Moyenne |
| Expense category list | expense-categories | Cartes / listes. Même principe que dépenses et répartition | Moyenne |
| Wishlist, Investissements, Planification, Actifs & passifs | pages + composants | Structure simple (titre + liste/cartes). Reprendre les mêmes règles : grilles 1/2/3 cols, en-têtes flex-col sur mobile | Basse |
| Paramètres | settings | Formulaire. Champs pleine largeur. OK | Basse |

---

### 2.7 Cibles tactiles et accessibilité

| Élément | Constat | Priorité |
|--------|--------|----------|
| Boutons icône (size="icon") | Souvent 32px. Recommandation WCAG : 44px min pour le touch | Moyenne |
| Liens et boutons dans listes | Pencil, Trash : zones cliquables petites sur mobile | Moyenne |

**Recommandation** : Sur les écrans tactiles, augmenter la zone de touch des boutons icône (ex. `min-h-[44px] min-w-[44px]` pour les actions dans les listes) ou laisser la taille actuelle si l’équipe privilégie la compacité. À trancher selon la cible utilisateur.

---

## 3. Synthèse des actions proposées

### Priorité haute
1. **BarChart objectifs (dashboard)** : adapter marges et largeur d’axe Y (ou libellés) pour éviter débordement horizontal sur mobile.
2. **Lignes liste Répartition** : `min-w-0` sur le bloc texte, et soit `flex-wrap` soit passage en colonne sur petit écran pour éviter que texte + boutons se chevauchent.
3. **Lignes liste Dépenses** : même traitement que Répartition.

### Priorité moyenne
4. **Layout dashboard** : padding main en `p-4 sm:p-6 md:p-8` (ou équivalent).
5. **MonthPicker / sélecteurs** : `w-full sm:w-[180px]` sur les pages Revenus (et ailleurs si même pattern).
6. **En-têtes de cartes** (liste répartition, liste dépenses) : en mobile, passer en `flex-col` (titre au-dessus, boutons en dessous).
7. **Dialogs** : contenu long avec `max-h-[90vh] overflow-y-auto` si ce n’est pas déjà le cas.
8. **Boutons icône** dans listes : envisager `min-h-[44px] min-w-[44px]` pour le touch (ou documenter le choix contraire).

### Priorité basse
9. Titres de page : `text-2xl sm:text-3xl` pour gagner un peu de place sur mobile.
10. Grille des 5 cartes du dashboard : optionnellement 2 colonnes dès `sm` au lieu de seulement à partir de `md`.
11. Safe area (encoche / barre système) : ajouter si besoin pour des devices avec encoche.
12. Vérifier Revenue list, Expense budget summary, Wishlist, Investissements, Planification, Actifs & passifs avec les mêmes principes (grilles, en-têtes, pas de largeur fixe inutile).

---

## 4. Ordre de mise en œuvre suggéré

1. Layout : padding main responsive.
2. Listes Répartition et Dépenses : lignes responsive (min-w-0, flex-col/flex-wrap, en-têtes cartes).
3. Dashboard : BarChart objectifs (marges / largeur axe / libellés).
4. MonthPicker et autres sélecteurs : largeur full sur mobile.
5. Dialogs : scroll si contenu long.
6. (Optionnel) Boutons icône 44px, titres responsive, grille 5 cartes, safe area.

---

## 5. Principes à réutiliser

- **Grilles** : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (ou 2/5 selon le cas) pour listes et cartes.
- **En-têtes de carte** : `flex-col gap-2 sm:flex-row sm:items-center sm:justify-between` pour éviter que titre et boutons se serrent.
- **Blocs texte** : `min-w-0` dans les flex pour permettre troncature / retour à la ligne ; `wrap-break-word` ou `break-words` pour les libellés longs.
- **Conteneurs** : `min-w-0` sur les cartes en grille pour éviter débordement.
- **Formulaires** : champs et boutons en pleine largeur sur mobile ; pas de largeur fixe inutile sur les contrôles.

Ce plan peut être suivi tel quel ou ajusté selon les retours après tests sur appareils réels.
