# Conventions de code

Règles de nommage, structure et limites à respecter pour garder le projet cohérent et maintenable.

## Nomenclature des fichiers

Tous les noms de fichiers sont en **anglais**, **minuscules**, avec le format **kebab-case** (`create-expense-dialog`).

| Type | Exemple | Notes |
| ---- | ------- | ----- |
| Composant React | `create-expense-dialog.tsx`, `revenue-form.tsx`, `savings-progress-card.tsx` | Un composant = un fichier |
| Hook | `use-revenues.ts`, `use-allocation-rules.ts`, `use-saving-goals.ts` | Préfixe `use-` |
| Utilitaire | `format-currency.ts`, `calculate-depreciation.ts`, `format-date.ts` | |
| Service API | `get-revenues.ts`, `create-expense.ts`, `delete-saving-goal.ts` | Verbe d'action |
| Types | `revenue.ts`, `expense-category.ts`, `saving-goal.ts` | Un modèle par fichier si volumineux |
| Slice Redux | `revenues-slice.ts`, `expenses-slice.ts` | Un slice par modèle |
| Page Next.js | `page.tsx`, `layout.tsx`, `loading.tsx` | Imposé par Next.js |

## Nomenclature du code (à l'intérieur des fichiers)

| Élément | Convention | Exemple |
| ------- | ---------- | ------- |
| Variables | camelCase | `totalExpenses`, `isLoading`, `currentMonth` |
| Fonctions | camelCase + verbe d'action | `calculateAllocation()`, `fetchRevenues()`, `formatCurrency()` |
| Composants React | PascalCase | `ExpenseCard`, `RevenueForm`, `CreateExpenseDialog` |
| Types / Interfaces | PascalCase | `Revenue`, `ExpenseCategory`, `SavingGoal` |
| Constantes | UPPER_SNAKE_CASE | `DEFAULT_CURRENCY`, `MAX_ALLOCATION_PERCENT` |
| Booléens | Préfixe `is`, `has`, `should` | `isRecurring`, `hasReachedGoal`, `shouldShowAlert` |
| Handlers | Préfixe `handle` | `handleSubmit`, `handleDelete`, `handleClose` |
| Props de composant | Suffixe `Props` | `RevenueFormProps`, `ExpenseCardProps` |
| Tableaux / listes | Pluriel | `revenues`, `categories`, `goals` |

## Limites de taille

| Élément | Limite | Action si dépassé |
| ------- | ------ | ----------------- |
| Fonction | 30 lignes max | Extraire en sous-fonctions |
| Composant React | 150 lignes max | Extraire des sous-composants |
| Fichier | 300 lignes max | Découper en modules |
| Paramètres d'une fonction | 4 max | Passer un objet `options` |
| Niveaux d'imbrication (if/for) | 3 max | Early return ou extraction |

## Règles générales

- **Langue du code** : anglais (variables, fonctions, composants, commentaires techniques)
- **Langue de l'UI** : français (labels, messages, textes affichés à l'utilisateur)
- **Un composant = un fichier** : pas de plusieurs composants dans le même fichier
- **Pas de `any`** : typer toutes les props et retours de fonction
- **Pas de logique métier dans les composants** : extraire dans hooks (`use-revenues.ts`) ou utils (`calculate-total.ts`)
- **Commentaires** : uniquement quand le "pourquoi" n'est pas évident, jamais pour le "quoi"

## Exemple d'import

```typescript
// Dans une page ou un composant
import { RevenueForm } from '@/models/revenues/components/revenue-form'
import { CreateExpenseDialog } from '@/models/expenses/components/create-expense-dialog'
import { useRevenues } from '@/models/revenues/hooks/use-revenues'
import { formatCurrency } from '@/utils/format-currency'
```
