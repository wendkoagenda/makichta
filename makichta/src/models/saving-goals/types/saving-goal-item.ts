export interface SavingGoalItem {
  id: string;
  savingGoalId: string;
  title: string;
  url: string | null;
  amount: number;
  description: string | null;
  order: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSavingGoalItemInput {
  savingGoalId: string;
  title: string;
  url?: string | null;
  amount: number;
  description?: string | null;
  order?: number | null;
}

export interface UpdateSavingGoalItemInput {
  title?: string;
  url?: string | null;
  amount?: number;
  description?: string | null;
  order?: number | null;
}
