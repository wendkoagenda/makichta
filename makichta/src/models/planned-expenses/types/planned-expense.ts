export interface PlannedExpense {
  id: string;
  label: string;
  estimatedAmount: number;
  dueDate: string;
  isRecurring: boolean;
  recurrenceInterval: string | null;
  isDone: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlannedExpenseInput {
  label: string;
  estimatedAmount: number;
  dueDate: string;
  isRecurring?: boolean;
  recurrenceInterval?: string | null;
}
