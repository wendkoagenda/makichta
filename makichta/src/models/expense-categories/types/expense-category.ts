export type ExpenseType = "FIXED" | "VARIABLE";
export type BudgetMode = "AMOUNT" | "PERCENT";

export interface ExpenseCategoryAllocationRule {
  id: string;
  label: string;
}

export interface ExpenseCategory {
  id: string;
  label: string;
  type: ExpenseType;
  monthlyBudget: number;
  budgetPercent: number | null;
  monthId: string;
  allocationRules?: ExpenseCategoryAllocationRule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseCategoryInput {
  label: string;
  type: ExpenseType;
  monthId: string;
  monthlyBudget?: number;
  budgetPercent?: number | null;
}

export interface UpdateExpenseCategoryInput {
  label?: string;
  type?: ExpenseType;
  monthlyBudget?: number;
  budgetPercent?: number | null;
}
