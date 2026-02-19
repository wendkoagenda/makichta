export type GoalPriority = "HIGH" | "MEDIUM" | "LOW";

export interface SavingGoal {
  id: string;
  label: string;
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
  targetAmount: number;
  deadline?: string | null;
  priority?: GoalPriority;
  projectId?: string | null;
}

export interface UpdateSavingGoalInput {
  label?: string;
  targetAmount?: number;
  deadline?: string | null;
  priority?: GoalPriority;
  projectId?: string | null;
}
