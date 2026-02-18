export type GoalPriority = "HIGH" | "MEDIUM" | "LOW";

export interface SavingGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  priority: GoalPriority;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSavingGoalInput {
  label: string;
  targetAmount: number;
  deadline?: string | null;
  priority?: GoalPriority;
}

export interface UpdateSavingGoalInput {
  label?: string;
  targetAmount?: number;
  deadline?: string | null;
  priority?: GoalPriority;
}
