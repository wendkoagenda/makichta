import { prisma } from "@/lib/db";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import type { AllocationRule } from "../types/allocation-rule";

const DEFAULT_RULES = [
  { label: "Épargne", percentage: 20 },
  { label: "Charges fixes", percentage: 40 },
  { label: "Loisirs", percentage: 15 },
  { label: "Investissement", percentage: 10 },
  { label: "Alimentation", percentage: 15 },
];

export async function seedDefaultAllocationRules(
  userId: string,
  monthId?: string
): Promise<AllocationRule[]> {
  const targetMonthId =
    typeof monthId === "string" && monthId ? monthId : getCurrentMonthId();
  const existing = await prisma.allocationRule.findFirst({
    where: { userId, monthId: targetMonthId },
  });
  if (existing) return [];

  await prisma.allocationRule.createMany({
    data: DEFAULT_RULES.map((r) => ({
      userId,
      label: r.label,
      allocationType: "PERCENT",
      percentage: r.percentage,
      monthId: targetMonthId,
    })),
  });

  const created = (await prisma.allocationRule.findMany({
    where: { userId, monthId: targetMonthId },
    orderBy: { createdAt: "asc" },
    include: { categories: { select: { id: true, label: true } } },
  })) as unknown as { id: string; label: string; allocationType: string; percentage: number; amount: number | null; monthId: string; createdAt: Date; updatedAt: Date; categories: { id: string; label: string }[] }[];

  return created.map((r) => ({
    id: r.id,
    label: r.label,
    allocationType: r.allocationType === "AMOUNT" ? "AMOUNT" : "PERCENT",
    percentage: r.percentage,
    amount: r.amount ?? null,
    monthId: r.monthId,
    categoryIds: r.categories.map((c) => c.id),
    categories: r.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
