import { prisma } from "@/lib/db";
import type {
  UpdateExpenseCategoryInput,
  ExpenseCategory,
} from "../types/expense-category";

export async function updateExpenseCategory(
  userId: string,
  id: string,
  input: UpdateExpenseCategoryInput
): Promise<ExpenseCategory | null> {
  const row = await prisma.expenseCategory.updateMany({
    where: { id, userId },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(input.type != null && { type: input.type }),
      ...(input.monthlyBudget != null && { monthlyBudget: input.monthlyBudget }),
      ...(input.budgetPercent !== undefined && {
        budgetPercent: input.budgetPercent,
      }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.expenseCategory.findUnique({
    where: { id },
  });

  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    type: updated.type as "FIXED" | "VARIABLE",
    monthlyBudget: updated.monthlyBudget,
    budgetPercent: updated.budgetPercent,
    monthId: (updated as { monthId: string }).monthId,
  };
}
