import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface MonthData {
  month: string;
  revenues: number;
  expenses: number;
  savings: number;
  investments: number;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
  const months = 12;

  const result: MonthData[] = [];

  for (let m = 1; m <= months; m++) {
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    const monthStr = `${year}-${String(m).padStart(2, "0")}`;

    const [revenues, expenses, contributions, investments] = await Promise.all([
      prisma.revenue.aggregate({
        where: {
          userId: session.user.id,
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: {
          userId: session.user.id,
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
      prisma.savingContribution.aggregate({
        where: {
          savingGoal: { userId: session.user.id },
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
      prisma.investment.aggregate({
        where: {
          userId: session.user.id,
          date: { gte: start, lt: end },
        },
        _sum: { amount: true },
      }),
    ]);

    result.push({
      month: monthStr,
      revenues: revenues._sum.amount ?? 0,
      expenses: expenses._sum.amount ?? 0,
      savings: contributions._sum.amount ?? 0,
      investments: investments._sum.amount ?? 0,
    });
  }

  return NextResponse.json(result);
}
