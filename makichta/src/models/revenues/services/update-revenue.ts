import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";
import type { UpdateRevenueInput, Revenue } from "../types/revenue";
import { recalculateAllocationsForRevenue } from "@/models/allocation-rules/services/create-allocations-for-revenue";

export async function updateRevenue(
  userId: string,
  id: string,
  input: UpdateRevenueInput
): Promise<Revenue | null> {
  const updateData: {
    sourceId?: string;
    amount?: number;
    date?: Date;
    monthId?: string;
    description?: string;
  } = {
    ...(input.sourceId != null && { sourceId: input.sourceId }),
    ...(input.amount != null && { amount: input.amount }),
    ...(input.description !== undefined && { description: input.description }),
  };
  if (input.date != null) {
    const date = new Date(input.date);
    updateData.date = date;
    updateData.monthId = getMonthIdFromDate(date);
  }

  const row = await prisma.revenue.updateMany({
    where: { id, userId },
    data: updateData,
  });

  if (row.count === 0) return null;

  const updated = await prisma.revenue.findUnique({ where: { id } });
  if (!updated) return null;

  if (input.amount != null) {
    await recalculateAllocationsForRevenue(
      userId,
      id,
      updated.amount,
      updated.date
    );
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
