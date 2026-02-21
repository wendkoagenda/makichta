import { prisma } from "@/lib/db";
import type {
  UpdateAllocationRuleInput,
  AllocationRule,
  AllocationRuleType,
} from "../types/allocation-rule";

export async function updateAllocationRule(
  userId: string,
  id: string,
  input: UpdateAllocationRuleInput
): Promise<AllocationRule | null> {
  const existing = await prisma.allocationRule.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  const allocationType: AllocationRuleType | undefined =
    input.allocationType === "AMOUNT" ? "AMOUNT" : input.allocationType === "PERCENT" ? "PERCENT" : undefined;
  const percentage =
    input.percentage != null && !Number.isNaN(Number(input.percentage))
      ? Math.min(100, Math.max(0, Number(input.percentage)))
      : undefined;
  const amount =
    input.amount !== undefined
      ? input.amount != null && !Number.isNaN(Number(input.amount))
        ? Math.max(0, Number(input.amount))
        : null
      : undefined;

  const categoryIds =
    input.expenseCategoryIds !== undefined
      ? Array.isArray(input.expenseCategoryIds)
        ? input.expenseCategoryIds.filter((id) => typeof id === "string" && id)
        : []
      : undefined;
  let savingGoalId: string | null | undefined =
    input.savingGoalId !== undefined
      ? input.savingGoalId != null && String(input.savingGoalId).trim() !== ""
        ? String(input.savingGoalId).trim()
        : null
      : undefined;
  if (savingGoalId) {
    const goal = await prisma.savingGoal.findFirst({
      where: { id: savingGoalId, userId },
    });
    if (!goal) savingGoalId = null;
  }

  const updated = (await prisma.allocationRule.update({
    where: { id },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(allocationType !== undefined && { allocationType }),
      ...(percentage !== undefined && { percentage }),
      ...(amount !== undefined && { amount }),
      ...(categoryIds !== undefined && {
        categories: { set: categoryIds.map((cid) => ({ id: cid })) },
      }),
      ...(savingGoalId !== undefined && { savingGoalId }),
    },
    include: {
      categories: { select: { id: true, label: true } },
    },
  })) as { savingGoalId: string | null; id: string; label: string; allocationType: string; percentage: number; amount: number | null; monthId: string; categories: { id: string; label: string }[]; createdAt: Date; updatedAt: Date };

  let savingGoal: { id: string; label: string } | null = null;
  if (updated.savingGoalId && userId) {
    const goal = await prisma.savingGoal.findFirst({
      where: { id: updated.savingGoalId, userId },
      select: { id: true, label: true },
    });
    if (goal) savingGoal = goal;
  }

  return {
    id: updated.id,
    label: updated.label,
    allocationType: updated.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT",
    percentage: updated.percentage,
    amount: updated.amount ?? null,
    monthId: updated.monthId,
    savingGoalId: updated.savingGoalId ?? undefined,
    savingGoal: savingGoal ? { id: savingGoal.id, label: savingGoal.label } : undefined,
    categoryIds: updated.categories.map((c) => c.id),
    categories: updated.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
