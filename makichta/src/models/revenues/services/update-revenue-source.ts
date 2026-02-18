import { prisma } from "@/lib/db";
import type { UpdateRevenueSourceInput, RevenueSource } from "../types/revenue-source";

export async function updateRevenueSource(
  userId: string,
  id: string,
  input: UpdateRevenueSourceInput
): Promise<RevenueSource | null> {
  const row = await prisma.revenueSource.updateMany({
    where: { id, userId },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(input.frequency != null && { frequency: input.frequency }),
      ...(input.recurrenceInterval !== undefined && {
        recurrenceInterval: input.recurrenceInterval,
      }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.revenueSource.findUnique({
    where: { id },
  });

  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    frequency: updated.frequency as "RECURRING" | "ONE_TIME",
    recurrenceInterval: updated.recurrenceInterval as
      | "WEEKLY"
      | "MONTHLY"
      | "YEARLY"
      | null,
  };
}
