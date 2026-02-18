export const INVESTMENT_TYPES = [
  "actions",
  "crypto",
  "immobilier",
  "obligations",
  "autres",
] as const;

export const INVESTMENT_TYPE_LABELS: Record<string, string> = {
  actions: "Actions",
  crypto: "Crypto",
  immobilier: "Immobilier",
  obligations: "Obligations",
  autres: "Autres",
};
