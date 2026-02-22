export const DEFAULT_CURRENCY = "USDT";
export const DEFAULT_PERIOD = "MONTHLY";

export const EXPENSE_TYPES = {
  FIXED: "FIXED",
  VARIABLE: "VARIABLE",
} as const;

export const FREQUENCIES = {
  RECURRING: "RECURRING",
  ONE_TIME: "ONE_TIME",
} as const;

export const RECURRENCE_INTERVALS = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export const PRIORITIES = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

/** Catégories de dépenses pour la répartition 8 postes (Essentiel, Dimes, Loisirs). */
export const DEFAULT_EXPENSE_CATEGORIES = [
  { label: "Essentiel", type: EXPENSE_TYPES.FIXED },
  { label: "Loisirs", type: EXPENSE_TYPES.VARIABLE },
  { label: "Dimes", type: EXPENSE_TYPES.VARIABLE },
];
