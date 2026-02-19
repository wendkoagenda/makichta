import { prisma } from "@/lib/db";
import type { AllocationRule } from "../types/allocation-rule";

interface RuleRowWithCategories {
  id: string;
  label: string;
  percentage: number;
  monthId: string;
  createdAt: Date;
  updatedAt: Date;
  categories: { id: string; label: string }[];
}

export async function getAllocationRules(
  userId: string,
  monthId: string
): Promise<AllocationRule[]> {
  const rows = (await prisma.allocationRule.findMany({
    where: { userId, monthId },
    orderBy: { label: "asc" },
    include: {
      categories: { select: { id: true, label: true } },
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- include categories
  } as any)) as unknown as RuleRowWithCategories[];

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    percentage: r.percentage,
    monthId: r.monthId,
    categoryIds: r.categories.map((c) => c.id),
    categories: r.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
