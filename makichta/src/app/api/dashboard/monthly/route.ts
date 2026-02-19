import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllocatedByCategoryForMonth } from "@/models/allocation-rules/services/get-allocated-by-category-for-month";

export interface MonthlyDashboardData {
  month: string;
  totalRevenues: number;
  totalExpenses: number;
  totalSavings: number; // contributions du mois
  totalInvestments: number;
  savingsRate: number; // % épargne = (revenus - dépenses) / revenus * 100
  remainingToLive: number; // revenus - dépenses
  expenseByCategory: {
    categoryId: string;
    label: string;
    amount: number;
    percent: number;
    allocated?: number;
  }[];
  goalsProgress: { label: string; current: number; target: number; percent: number }[];
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const monthId = searchParams.get("month");
  if (!monthId || !/^\d{4}-\d{2}$/.test(monthId)) {
    return NextResponse.json(
      { error: "Paramètre month requis (YYYY-MM)" },
      { status: 400 }
    );
  }

  const [year, m] = monthId.split("-").map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1);

  const [expenses, contributions, investments, categories, goals, allocatedByCategory] =
    await Promise.all([
      prisma.expense.findMany({
        where: { userId: session.user.id, monthId },
        include: { category: true },
      }),
      prisma.savingContribution.findMany({
        where: {
          savingGoal: { userId: session.user.id },
          monthId,
        },
      }),
      prisma.investment.findMany({
        where: {
          userId: session.user.id,
          date: { gte: start, lt: end },
        },
      }),
      prisma.expenseCategory.findMany({
        where: { userId: session.user.id, monthId },
      }),
      prisma.savingGoal.findMany({
        where: { userId: session.user.id },
      }),
      getAllocatedByCategoryForMonth(session.user.id, monthId),
    ]);

  const revenues = await prisma.revenue.findMany({
    where: { userId: session.user.id, monthId },
  });

  const totalRevenues = revenues.reduce((s, r) => s + r.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSavings = contributions.reduce((s, c) => s + c.amount, 0);
  const totalInvestments = investments.reduce((s, i) => s + i.amount, 0);
  const remainingToLive = totalRevenues - totalExpenses;
  const savingsRate =
    totalRevenues > 0
      ? Math.round(((totalRevenues - totalExpenses) / totalRevenues) * 1000) / 10
      : 0;

  const categoryIdToLabel = new Map(categories.map((c) => [c.id, c.label]));
  const byCategoryId = expenses.reduce(
    (acc, e) => {
      const cid = e.categoryId ?? "other";
      const label = e.category?.label ?? "Autre";
      if (!acc[cid]) acc[cid] = { label, amount: 0 };
      acc[cid].amount += e.amount;
      acc[cid].label = label;
      return acc;
    },
    {} as Record<string, { label: string; amount: number }>
  );

  const categoryIdsFromExpenses = new Set(Object.keys(byCategoryId));
  const categoryIdsWithAllocated = new Set(Object.keys(allocatedByCategory));
  const allCategoryIds = new Set([
    ...categoryIdsFromExpenses,
    ...categoryIdsWithAllocated,
  ]);

  const expenseByCategory = Array.from(allCategoryIds).map((categoryId) => {
    const spent = byCategoryId[categoryId]?.amount ?? 0;
    const label =
      byCategoryId[categoryId]?.label ??
      categoryIdToLabel.get(categoryId) ??
      "Autre";
    const allocated = allocatedByCategory[categoryId];
    return {
      categoryId,
      label,
      amount: spent,
      percent: totalExpenses > 0 ? (spent / totalExpenses) * 100 : 0,
      ...(allocated != null && allocated > 0 && { allocated }),
    };
  });
  expenseByCategory.sort((a, b) => b.amount - a.amount);

  const goalsProgress = goals.map((g) => ({
    label: g.label,
    current: g.currentAmount,
    target: g.targetAmount,
    percent:
      g.targetAmount > 0
        ? Math.min(100, (g.currentAmount / g.targetAmount) * 100)
        : 0,
  }));

  const data: MonthlyDashboardData = {
    month: monthId,
    totalRevenues,
    totalExpenses,
    totalSavings,
    totalInvestments,
    savingsRate,
    remainingToLive,
    expenseByCategory,
    goalsProgress,
  };

  return NextResponse.json(data);
}
