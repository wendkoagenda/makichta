export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  createdAt?: string;
}

export interface CreateExpenseInput {
  categoryId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface UpdateExpenseInput {
  categoryId?: string;
  amount?: number;
  date?: string;
  description?: string;
}
