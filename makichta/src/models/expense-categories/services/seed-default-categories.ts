import { prisma } from "@/lib/db";
import { DEFAULT_EXPENSE_CATEGORIES } from "@/lib/constants";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import type { ExpenseCategory } from "../types/expense-category";
import { getExpenseCategories } from "./get-expense-categories";

export async function seedDefaultExpenseCategories(
  userId: string,
  monthId?: string
): Promise<ExpenseCategory[]> {
  const targetMonthId =
    typeof monthId === "string" && monthId ? monthId : getCurrentMonthId();
  const existing = await prisma.expenseCategory.count({
    where: { userId, monthId: targetMonthId },
  });

  if (existing > 0) return getExpenseCategories(userId, targetMonthId);

  await prisma.expenseCategory.createMany({
    data: DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
      userId,
      label: c.label,
      type: c.type,
      monthlyBudget: 0,
      monthId: targetMonthId,
    })),
  });

  return getExpenseCategories(userId, targetMonthId);
}
