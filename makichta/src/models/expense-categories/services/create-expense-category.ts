import { prisma } from "@/lib/db";
import type {
  CreateExpenseCategoryInput,
  ExpenseCategory,
} from "../types/expense-category";

export async function createExpenseCategory(
  userId: string,
  input: CreateExpenseCategoryInput
): Promise<ExpenseCategory> {
  const row = await prisma.expenseCategory.create({
    data: {
      userId,
      label: input.label,
      type: input.type,
      monthlyBudget: input.monthlyBudget ?? 0,
      budgetPercent: input.budgetPercent ?? null,
    },
  });

  return {
    id: row.id,
    label: row.label,
    type: row.type as "FIXED" | "VARIABLE",
    monthlyBudget: row.monthlyBudget,
    budgetPercent: row.budgetPercent,
  };
}
