import { prisma } from "@/lib/db";
import type { Expense } from "../types/expense";

export interface ExpenseWithCategory extends Expense {
  categoryLabel?: string;
}

interface GetExpensesParams {
  userId: string;
  categoryId?: string;
  monthId?: string;
}

export async function getExpenses({
  userId,
  categoryId,
  monthId,
}: GetExpensesParams): Promise<ExpenseWithCategory[]> {
  const where: { userId: string; categoryId?: string; monthId?: string } = {
    userId,
  };
  if (categoryId) where.categoryId = categoryId;
  if (monthId) where.monthId = monthId;

  const rows = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
    include: { category: { select: { label: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    categoryId: r.categoryId,
    amount: r.amount,
    date: r.date.toISOString().slice(0, 10),
    description: r.description,
    createdAt: r.createdAt?.toISOString(),
    categoryLabel: r.category.label,
  }));
}
