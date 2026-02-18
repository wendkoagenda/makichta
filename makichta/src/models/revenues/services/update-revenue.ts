import { prisma } from "@/lib/db";
import type { UpdateRevenueInput, Revenue } from "../types/revenue";
import { recalculateAllocationsForRevenue } from "@/models/allocation-rules/services/create-allocations-for-revenue";

export async function updateRevenue(
  userId: string,
  id: string,
  input: UpdateRevenueInput
): Promise<Revenue | null> {
  const row = await prisma.revenue.updateMany({
    where: { id, userId },
    data: {
      ...(input.sourceId != null && { sourceId: input.sourceId }),
      ...(input.amount != null && { amount: input.amount }),
      ...(input.date != null && { date: new Date(input.date) }),
      ...(input.description !== undefined && { description: input.description }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.revenue.findUnique({ where: { id } });
  if (!updated) return null;

  if (input.amount != null) {
    await recalculateAllocationsForRevenue(userId, id, updated.amount);
  }

  return {
    id: updated.id,
    sourceId: updated.sourceId,
    amount: updated.amount,
    date: updated.date.toISOString().slice(0, 10),
    description: updated.description,
    createdAt: updated.createdAt?.toISOString(),
  };
}
