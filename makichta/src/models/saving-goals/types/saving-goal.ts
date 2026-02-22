export type GoalPriority = "HIGH" | "MEDIUM" | "LOW";

/** TARGET = épargne destinée à une dépense prévue, EMERGENCY = fonds de secours */
export type SavingGoalType = "TARGET" | "EMERGENCY";

/** ACTIVE = objectif en cours, COMPLETED = validé / archivé (argent utilisé) */
export type SavingGoalStatus = "ACTIVE" | "COMPLETED";

export interface SavingGoal {
  id: string;
  label: string;
  savingType: SavingGoalType;
  targetAmount: number;
  currentAmount: number;
  status: SavingGoalStatus;
  deadline: string | null;
  priority: GoalPriority;
  projectId?: string | null;
  projectLabel?: string;
  createdAt?: string;
  updatedAt?: string;
  /** Montant alloué ce mois par la règle d'allocation (si objectif lié à une règle). */
  allocatedThisMonth?: number;
  /** Somme des contributions ce mois pour cet objectif. */
  contributionsThisMonth?: number;
}

export interface CreateSavingGoalInput {
  label: string;
  savingType?: SavingGoalType;
  targetAmount: number;
  deadline?: string | null;
  priority?: GoalPriority;
  projectId?: string | null;
}

export interface UpdateSavingGoalInput {
  label?: string;
  savingType?: SavingGoalType;
  targetAmount?: number;
  deadline?: string | null;
  priority?: GoalPriority;
  projectId?: string | null;
}
