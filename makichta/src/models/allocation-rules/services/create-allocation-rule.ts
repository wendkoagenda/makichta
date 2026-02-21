import { prisma } from "@/lib/db";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import type {
  CreateAllocationRuleInput,
  AllocationRule,
  AllocationRuleType,
} from "../types/allocation-rule";

export async function createAllocationRule(
  userId: string,
  input: CreateAllocationRuleInput
): Promise<AllocationRule> {
  const categoryIds = Array.isArray(input.expenseCategoryIds)
    ? input.expenseCategoryIds.filter((id) => typeof id === "string" && id)
    : [];
  const monthId =
    typeof input.monthId === "string" && input.monthId ? input.monthId : getCurrentMonthId();
  const allocationType: AllocationRuleType =
    input.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT";
  const percentage =
    allocationType === "PERCENT"
      ? Math.min(100, Math.max(0, input.percentage ?? 0))
      : 0;
  const amount =
    allocationType === "AMOUNT" && input.amount != null && !Number.isNaN(Number(input.amount))
      ? Math.max(0, Number(input.amount))
      : null;
  let savingGoalId: string | null =
    input.savingGoalId != null && String(input.savingGoalId).trim() !== ""
      ? String(input.savingGoalId).trim()
      : null;
  if (savingGoalId) {
    const goal = await prisma.savingGoal.findFirst({
      where: { id: savingGoalId, userId },
    });
    if (!goal) savingGoalId = null;
  }

  const row = (await prisma.allocationRule.create({
    data: {
      userId,
      label: input.label,
      allocationType,
      percentage,
      ...(amount != null && { amount }),
      monthId,
      ...(categoryIds.length > 0 && {
        categories: { connect: categoryIds.map((id) => ({ id })) },
      }),
      ...(savingGoalId && { savingGoalId }),
    },
    include: {
      categories: { select: { id: true, label: true } },
    },
  })) as { savingGoalId: string | null; id: string; label: string; allocationType: string; percentage: number; amount: number | null; monthId: string; categories: { id: string; label: string }[]; createdAt: Date; updatedAt: Date };

  let savingGoal: { id: string; label: string } | null = null;
  if (row.savingGoalId) {
    const goal = await prisma.savingGoal.findFirst({
      where: { id: row.savingGoalId, userId },
      select: { id: true, label: true },
    });
    if (goal) savingGoal = goal;
  }

  return {
    id: row.id,
    label: row.label,
    allocationType: row.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT",
    percentage: row.percentage,
    amount: row.amount ?? null,
    monthId: row.monthId,
    savingGoalId: row.savingGoalId ?? undefined,
    savingGoal: savingGoal ? { id: savingGoal.id, label: savingGoal.label } : undefined,
    categoryIds: row.categories.map((c) => c.id),
    categories: row.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
