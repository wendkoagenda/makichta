export type GoalPriority = "HIGH" | "MEDIUM" | "LOW";

/** TARGET = épargne destinée à une dépense prévue, EMERGENCY = fonds de secours */
export type SavingGoalType = "TARGET" | "EMERGENCY";

export interface SavingGoal {
  id: string;
  label: string;
  savingType: SavingGoalType;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  priority: GoalPriority;
  projectId?: string | null;
  projectLabel?: string;
  createdAt?: string;
  updatedAt?: string;
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
