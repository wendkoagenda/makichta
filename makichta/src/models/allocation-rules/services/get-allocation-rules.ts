import { prisma } from "@/lib/db";
import type { AllocationRule } from "../types/allocation-rule";

export async function getAllocationRules(
  userId: string,
  monthId: string
): Promise<AllocationRule[]> {
  const [rows, revenues] = await Promise.all([
    prisma.allocationRule.findMany({
      where: { userId, monthId },
      orderBy: { label: "asc" },
      include: {
        categories: { select: { id: true, label: true } },
      },
    }),
    prisma.revenue.findMany({
      where: { userId, monthId },
      select: { amount: true },
    }),
  ]);

  const totalRevenues = revenues.reduce((s, r) => s + r.amount, 0);

  const goalIds = [
    ...new Set(
      rows
        .map((r) => r.savingGoalId)
        .filter((id): id is string => id != null && id !== "")
    ),
  ];
  const goals =
    goalIds.length > 0
      ? await prisma.savingGoal.findMany({
          where: { id: { in: goalIds }, userId },
          select: { id: true, label: true },
        })
      : [];
  const goalMap = new Map(goals.map((g) => [g.id, g]));

  return rows.map((r) => {
    const allocationType = (r.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT") as "PERCENT" | "AMOUNT";
    const calculatedAmount =
      allocationType === "AMOUNT"
        ? Math.round((r.amount ?? 0) * 100) / 100
        : Math.round((totalRevenues * (r.percentage / 100)) * 100) / 100;
    return {
      id: r.id,
      label: r.label,
      allocationType,
      percentage: r.percentage,
      amount: r.amount ?? null,
      monthId: r.monthId,
      calculatedAmount,
      savingGoalId: r.savingGoalId ?? undefined,
    savingGoal:
      r.savingGoalId && goalMap.has(r.savingGoalId)
        ? { id: goalMap.get(r.savingGoalId)!.id, label: goalMap.get(r.savingGoalId)!.label }
        : undefined,
      categoryIds: r.categories.map((c) => c.id),
      categories: r.categories.map((c) => ({ id: c.id, label: c.label })),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
    };
  });
}
