import { prisma } from "@/lib/db";
import type { ExpenseCategory } from "../types/expense-category";

export async function getExpenseCategories(
  userId: string
): Promise<ExpenseCategory[]> {
  const rows = await prisma.expenseCategory.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    type: r.type as "FIXED" | "VARIABLE",
    monthlyBudget: r.monthlyBudget,
    budgetPercent: r.budgetPercent,
  }));
}
