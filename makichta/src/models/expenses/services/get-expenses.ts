import { prisma } from "@/lib/db";
import type { Expense } from "../types/expense";

export interface ExpenseWithCategory extends Expense {
  categoryLabel?: string;
}

interface GetExpensesParams {
  userId: string;
  categoryId?: string;
  month?: string;
}

export async function getExpenses({
  userId,
  categoryId,
  month,
}: GetExpensesParams): Promise<ExpenseWithCategory[]> {
  const where: { userId: string; categoryId?: string; date?: { gte: Date; lt: Date } } = {
    userId,
  };
  if (categoryId) where.categoryId = categoryId;
  if (month) {
    const [y, m] = month.split("-").map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 1);
    where.date = { gte: start, lt: end };
  }

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
