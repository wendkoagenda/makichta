export type ExpenseType = "FIXED" | "VARIABLE";
export type BudgetMode = "AMOUNT" | "PERCENT";

export interface ExpenseCategory {
  id: string;
  label: string;
  type: ExpenseType;
  monthlyBudget: number;
  budgetPercent: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseCategoryInput {
  label: string;
  type: ExpenseType;
  monthlyBudget?: number;
  budgetPercent?: number | null;
}

export interface UpdateExpenseCategoryInput {
  label?: string;
  type?: ExpenseType;
  monthlyBudget?: number;
  budgetPercent?: number | null;
}
