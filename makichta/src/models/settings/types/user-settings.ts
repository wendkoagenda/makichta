export interface UserSettings {
  currency: string;
  periodReference: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  currency: "USDT",
  periodReference: "MONTHLY",
};

export const AVAILABLE_CURRENCIES = [
  { value: "USDT", label: "USDT (Tether)" },
  { value: "XOF", label: "Franc CFA (XOF)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "USD", label: "Dollar ($)" },
];

export const AVAILABLE_PERIODS = [
  { value: "MONTHLY", label: "Mensuelle" },
  { value: "WEEKLY", label: "Hebdomadaire" },
];
