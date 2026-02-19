import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";
import type { CreateRevenueInput, Revenue } from "../types/revenue";
import { createAllocationsForRevenue } from "@/models/allocation-rules/services/create-allocations-for-revenue";

export async function createRevenue(
  userId: string,
  input: CreateRevenueInput
): Promise<Revenue> {
  const date = new Date(input.date);
  const monthId = getMonthIdFromDate(date);
  const row = await prisma.revenue.create({
    data: {
      userId,
      sourceId: input.sourceId,
      monthId,
      amount: input.amount,
      date,
      description: input.description ?? "",
    },
  });

  await createAllocationsForRevenue(userId, row.id, row.amount, row.date);

  return {
    id: row.id,
    sourceId: row.sourceId,
    amount: row.amount,
    date: row.date.toISOString().slice(0, 10),
    description: row.description,
    createdAt: row.createdAt?.toISOString(),
  };
}
