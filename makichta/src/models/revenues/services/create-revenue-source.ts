import { prisma } from "@/lib/db";
import type { CreateRevenueSourceInput, RevenueSource } from "../types/revenue-source";

export async function createRevenueSource(
  userId: string,
  input: CreateRevenueSourceInput
): Promise<RevenueSource> {
  const row = await prisma.revenueSource.create({
    data: {
      userId,
      label: input.label,
      frequency: input.frequency,
      recurrenceInterval: input.recurrenceInterval,
    },
  });

  return {
    id: row.id,
    label: row.label,
    frequency: row.frequency as "RECURRING" | "ONE_TIME",
    recurrenceInterval: row.recurrenceInterval as
      | "WEEKLY"
      | "MONTHLY"
      | "YEARLY"
      | null,
  };
}
