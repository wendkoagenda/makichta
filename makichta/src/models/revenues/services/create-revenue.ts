import { prisma } from "@/lib/db";
import type { CreateRevenueInput, Revenue } from "../types/revenue";

export async function createRevenue(
  userId: string,
  input: CreateRevenueInput
): Promise<Revenue> {
  const row = await prisma.revenue.create({
    data: {
      userId,
      sourceId: input.sourceId,
      amount: input.amount,
      date: new Date(input.date),
      description: input.description ?? "",
    },
  });

  return {
    id: row.id,
    sourceId: row.sourceId,
    amount: row.amount,
    date: row.date.toISOString().slice(0, 10),
    description: row.description,
    createdAt: row.createdAt?.toISOString(),
  };
}
