import { prisma } from "@/lib/db";
import type {
  UpdateAllocationRuleInput,
  AllocationRule,
} from "../types/allocation-rule";

export async function updateAllocationRule(
  userId: string,
  id: string,
  input: UpdateAllocationRuleInput
): Promise<AllocationRule | null> {
  const row = await prisma.allocationRule.updateMany({
    where: { id, userId },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(input.percentage != null && {
        percentage: Math.min(100, Math.max(0, input.percentage)),
      }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.allocationRule.findUnique({
    where: { id },
  });

  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    percentage: updated.percentage,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
