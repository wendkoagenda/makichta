import { prisma } from "@/lib/db";
import type { AllocationRule } from "../types/allocation-rule";

const DEFAULT_RULES = [
  { label: "Épargne", percentage: 20 },
  { label: "Charges fixes", percentage: 40 },
  { label: "Loisirs", percentage: 15 },
  { label: "Investissement", percentage: 10 },
  { label: "Alimentation", percentage: 15 },
];

export async function seedDefaultAllocationRules(
  userId: string
): Promise<AllocationRule[]> {
  const existing = await prisma.allocationRule.findFirst({
    where: { userId },
  });
  if (existing) return [];

  await prisma.allocationRule.createMany({
    data: DEFAULT_RULES.map((r) => ({
      userId,
      label: r.label,
      percentage: r.percentage,
    })),
  });

  const created = await prisma.allocationRule.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return created.map((r: { id: string; label: string; percentage: number; createdAt: Date; updatedAt: Date }) => ({
    id: r.id,
    label: r.label,
    percentage: r.percentage,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
