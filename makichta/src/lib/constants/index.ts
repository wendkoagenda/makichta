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

export const DEFAULT_EXPENSE_CATEGORIES = [
  { label: "Loyer", type: EXPENSE_TYPES.FIXED },
  { label: "Abonnements", type: EXPENSE_TYPES.FIXED },
  { label: "Assurances", type: EXPENSE_TYPES.FIXED },
  { label: "Alimentation", type: EXPENSE_TYPES.VARIABLE },
  { label: "Transport", type: EXPENSE_TYPES.VARIABLE },
  { label: "Loisirs", type: EXPENSE_TYPES.VARIABLE },
];
