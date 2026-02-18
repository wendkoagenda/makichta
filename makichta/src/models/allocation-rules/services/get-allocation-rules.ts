import { prisma } from "@/lib/db";
import type { AllocationRule } from "../types/allocation-rule";

export async function getAllocationRules(
  userId: string
): Promise<AllocationRule[]> {
  const rows = await prisma.allocationRule.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    percentage: r.percentage,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
