import { prisma } from "@/lib/db";

export interface CategorySummary {
  categoryId: string;
  categoryLabel: string;
  budget: number;
  spent: number;
  isOverBudget: boolean;
  remaining: number;
}

export interface ExpenseSummary {
  month: string;
  totalRevenues: number;
  totalExpenses: number;
  categories: CategorySummary[];
}

export async function getExpenseSummary(
  userId: string,
  month: string
): Promise<ExpenseSummary> {
  const [year, m] = month.split("-").map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1);

  const [categories, expenses, revenues] = await Promise.all([
    prisma.expenseCategory.findMany({
      where: { userId },
      orderBy: { label: "asc" },
    }),
    prisma.expense.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
    }),
    prisma.revenue.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
    }),
  ]);

  const totalRevenues = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const spentByCategory = expenses.reduce(
    (acc, e) => {
      acc[e.categoryId] = (acc[e.categoryId] ?? 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoriesSummary: CategorySummary[] = categories.map((c) => {
    const budget =
      c.budgetPercent != null
        ? Math.round((totalRevenues * (c.budgetPercent / 100)) * 100) / 100
        : c.monthlyBudget;
    const spent = spentByCategory[c.id] ?? 0;
    const remaining = Math.round((budget - spent) * 100) / 100;
    return {
      categoryId: c.id,
      categoryLabel: c.label,
      budget,
      spent,
      isOverBudget: spent > budget,
      remaining,
    };
  });

  return {
    month,
    totalRevenues,
    totalExpenses,
    categories: categoriesSummary,
  };
}
