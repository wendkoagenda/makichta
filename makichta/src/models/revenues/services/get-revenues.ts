import { prisma } from "@/lib/db";
import type { Revenue } from "../types/revenue";

interface GetRevenuesOptions {
  userId: string;
  sourceId?: string;
  monthId?: string; // YYYY-MM
}

export async function getRevenues(options: GetRevenuesOptions): Promise<Revenue[]> {
  const { userId, sourceId, monthId } = options;

  const where: {
    userId: string;
    sourceId?: string;
    monthId?: string;
  } = { userId };

  if (sourceId) where.sourceId = sourceId;
  if (monthId) where.monthId = monthId;

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
