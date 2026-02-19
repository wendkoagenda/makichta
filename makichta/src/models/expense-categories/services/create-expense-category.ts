import { prisma } from "@/lib/db";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import type {
  CreateExpenseCategoryInput,
  ExpenseCategory,
} from "../types/expense-category";

export async function createExpenseCategory(
  userId: string,
  input: CreateExpenseCategoryInput
): Promise<ExpenseCategory> {
  const monthId =
    typeof input.monthId === "string" && input.monthId ? input.monthId : getCurrentMonthId();
  const row = await prisma.expenseCategory.create({
    data: {
      userId,
      label: input.label,
      type: input.type,
      monthlyBudget: input.monthlyBudget ?? 0,
      budgetPercent: input.budgetPercent ?? null,
      monthId,
    },
  });

  return {
    id: row.id,
    label: row.label,
    type: row.type as "FIXED" | "VARIABLE",
    monthlyBudget: row.monthlyBudget,
    budgetPercent: row.budgetPercent,
    monthId: row.monthId,
  };
}
