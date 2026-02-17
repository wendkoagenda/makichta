# Schéma de base de données (v1)

Base de données : **SQLite** via **Prisma ORM**

## Diagramme entité-relation

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string passwordHash
        string name
        string currency
        string periodReference
        datetime createdAt
        datetime updatedAt
    }

    RevenueSource {
        string id PK
        string userId FK
        string label
        string frequency
        string recurrenceInterval
        datetime createdAt
        datetime updatedAt
    }

    Revenue {
        string id PK
        string userId FK
        string sourceId FK
        decimal amount
        date date
        string description
        datetime createdAt
    }

    AllocationRule {
        string id PK
        string userId FK
        string label
        decimal percentage
        datetime createdAt
        datetime updatedAt
    }

    Allocation {
        string id PK
        string revenueId FK
        string ruleId FK
        decimal amount
        datetime createdAt
    }

    ExpenseCategory {
        string id PK
        string userId FK
        string label
        string type
        decimal monthlyBudget
        datetime createdAt
        datetime updatedAt
    }

    Expense {
        string id PK
        string userId FK
        string categoryId FK
        decimal amount
        date date
        string description
        datetime createdAt
    }

    SavingGoal {
        string id PK
        string userId FK
        string label
        decimal targetAmount
        decimal currentAmount
        date deadline
        string priority
        datetime createdAt
        datetime updatedAt
    }

    SavingContribution {
        string id PK
        string savingGoalId FK
        decimal amount
        date date
        boolean isAutomatic
        datetime createdAt
    }

    Investment {
        string id PK
        string userId FK
        string type
        decimal amount
        date date
        string description
        datetime createdAt
    }

    PlannedExpense {
        string id PK
        string userId FK
        string label
        decimal estimatedAmount
        date dueDate
        boolean isRecurring
        string recurrenceInterval
        boolean isDone
        datetime createdAt
        datetime updatedAt
    }

    WishlistItem {
        string id PK
        string userId FK
        string label
        decimal estimatedCost
        string priority
        string url
        string savingGoalId FK
        datetime createdAt
        datetime updatedAt
    }

    Asset {
        string id PK
        string userId FK
        string label
        decimal purchaseValue
        integer depreciationDurationMonths
        date acquisitionDate
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ RevenueSource : "cree"
    User ||--o{ Revenue : "percoit"
    User ||--o{ AllocationRule : "definit"
    User ||--o{ ExpenseCategory : "cree"
    User ||--o{ Expense : "enregistre"
    User ||--o{ SavingGoal : "vise"
    User ||--o{ Investment : "investit"
    User ||--o{ PlannedExpense : "planifie"
    User ||--o{ WishlistItem : "souhaite"
    User ||--o{ Asset : "possede"

    RevenueSource ||--o{ Revenue : "genere"
    Revenue ||--o{ Allocation : "reparti-en"
    AllocationRule ||--o{ Allocation : "appliquee-a"
    ExpenseCategory ||--o{ Expense : "categorise"
    SavingGoal ||--o{ SavingContribution : "alimente-par"
    SavingGoal o|--o{ WishlistItem : "converti-depuis"
```

## Description des entités

### User

Utilisateur de l'application. Porte les préférences globales (devise d'affichage parmi USDT/XOF/EUR/USD, période). Toutes les saisies sont en USDT. Toutes les entités métier sont cloisonnées par `userId`.

### RevenueSource

Type de source de revenu créé par l'utilisateur (ex. : "Salaire CDI", "Freelance", "Allocation CAF").

- `frequency` : `RECURRING` ou `ONE_TIME`
- `recurrenceInterval` : `MONTHLY`, `WEEKLY`, `YEARLY`, `null` (si ponctuelle)

### Revenue

Revenu perçu, rattaché à une source. Montant, date de perception et description optionnelle.

### AllocationRule

Règle de répartition définie par l'utilisateur. Chaque règle a un libellé (ex. : "Épargne", "Charges fixes") et un pourcentage. La somme des pourcentages de toutes les règles d'un utilisateur doit faire 100%.

### Allocation

Enregistrement concret d'une répartition : quand un revenu est saisi, une ligne Allocation est créée pour chaque AllocationRule, avec le montant calculé (revenu x pourcentage).

### ExpenseCategory

Catégorie de dépense définie par l'utilisateur.

- `type` : `FIXED` (loyer, abonnements) ou `VARIABLE` (alimentation, loisirs)
- `monthlyBudget` : budget mensuel prévu pour cette catégorie

### Expense

Dépense enregistrée, obligatoirement liée à une catégorie.

### SavingGoal

Objectif d'épargne avec montant cible, échéance optionnelle et priorité (`HIGH`, `MEDIUM`, `LOW`). Le champ `currentAmount` est mis à jour à chaque contribution.

### SavingContribution

Contribution versée vers un objectif d'épargne. Peut être automatique (via répartition) ou manuelle.

### Investment

Opération d'investissement. Le champ `type` est libre (actions, crypto, immobilier, autres).

### PlannedExpense

Dépense future planifiée, ponctuelle ou récurrente. Le champ `isDone` passe à `true` quand elle est réalisée.

- `recurrenceInterval` : `MONTHLY`, `YEARLY`, `null` (si ponctuelle)

### WishlistItem

Achat souhaité à moyen/long terme. Peut être converti en objectif d'épargne (lien via `savingGoalId`).

- `priority` : `HIGH`, `MEDIUM`, `LOW`
- `url` : lien optionnel vers le produit

### Asset

Bien soumis à amortissement linéaire.

- `depreciationDurationMonths` : durée d'amortissement en mois
- Valeur résiduelle calculée dynamiquement : `purchaseValue - (amortissement mensuel x mois écoulés)`
- Amortissement mensuel : `purchaseValue / depreciationDurationMonths`

## Relations clés

- **User -> tout** : chaque entité métier appartient à un utilisateur (cloisonnement)
- **RevenueSource -> Revenue** : un revenu est toujours rattaché à une source
- **Revenue -> Allocation** : un revenu génère N allocations (une par règle de répartition)
- **AllocationRule -> Allocation** : chaque règle est appliquée à chaque revenu
- **ExpenseCategory -> Expense** : chaque dépense est catégorisée
- **SavingGoal -> SavingContribution** : un objectif est alimenté par des contributions
- **SavingGoal <- WishlistItem** : un item wishlist peut être converti en objectif d'épargne

## Flux de données principal

```mermaid
flowchart LR
    A[Revenu saisi] --> B[Repartition auto]
    B --> C[Enveloppe charges fixes]
    B --> D[Enveloppe epargne]
    B --> E[Enveloppe loisirs]
    B --> F[Enveloppe investissement]
    C --> G[Depenses par categorie]
    D --> H[Objectifs epargne]
    E --> G
    F --> I[Operations investissement]
    G --> J[Dashboard mensuel]
    H --> J
    I --> J
```
