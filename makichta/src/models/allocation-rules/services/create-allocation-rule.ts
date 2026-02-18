import { prisma } from "@/lib/db";
import type {
  CreateAllocationRuleInput,
  AllocationRule,
} from "../types/allocation-rule";

export async function createAllocationRule(
  userId: string,
  input: CreateAllocationRuleInput
): Promise<AllocationRule> {
  const row = await prisma.allocationRule.create({
    data: {
      userId,
      label: input.label,
      percentage: Math.min(100, Math.max(0, input.percentage)),
    },
  });

  return {
    id: row.id,
    label: row.label,
    percentage: row.percentage,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
