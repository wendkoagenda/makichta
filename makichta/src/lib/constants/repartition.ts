/**
 * Répartition en 8 postes (100 %) : règles d'allocation par défaut.
 * Chaque règle est soit liée à une catégorie de dépense (type "category"),
 * soit à un objectif d'épargne (type "saving").
 */
export const REPARTITION_RULES = [
  { label: "Essentiel", percentage: 40, type: "category" as const },
  { label: "Fonds d'urgence", percentage: 15, type: "saving" as const },
  { label: "Ecom", percentage: 10, type: "saving" as const },
  { label: "Déménagement", percentage: 10, type: "saving" as const },
  { label: "Mariage", percentage: 5, type: "saving" as const },
  {
    label: "BRVM Trading et autres investissement",
    percentage: 5,
    type: "saving" as const,
  },
  { label: "Dimes", percentage: 10, type: "category" as const },
  { label: "Loisirs", percentage: 5, type: "category" as const },
] as const;

/** Libellés des 5 objectifs d'épargne (un projet + un objectif par libellé). */
export const SAVING_GOAL_LABELS = [
  "Fonds d'urgence",
  "Ecom",
  "Déménagement",
  "Mariage",
  "BRVM Trading et autres investissement",
] as const;

/** Fonds d'urgence est de type EMERGENCY, les autres sont TARGET. */
export const SAVING_GOAL_EMERGENCY_LABEL = "Fonds d'urgence";
