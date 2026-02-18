import { prisma } from "@/lib/db";
import type { Revenue } from "../types/revenue";

interface GetRevenuesOptions {
  userId: string;
  sourceId?: string;
  month?: string; // YYYY-MM
}

export async function getRevenues(options: GetRevenuesOptions): Promise<Revenue[]> {
  const { userId, sourceId, month } = options;

  const where: {
    userId: string;
    sourceId?: string;
    date?: { gte: Date; lt: Date };
  } = { userId };

  if (sourceId) where.sourceId = sourceId;

  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);
    where.date = { gte: start, lt: end };
  }

  const rows = await prisma.revenue.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    sourceId: r.sourceId,
    amount: r.amount,
    date: r.date.toISOString().slice(0, 10),
    description: r.description,
    createdAt: r.createdAt?.toISOString(),
  }));
}
