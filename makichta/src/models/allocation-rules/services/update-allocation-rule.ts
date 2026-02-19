import { prisma } from "@/lib/db";
import type {
  UpdateAllocationRuleInput,
  AllocationRule,
} from "../types/allocation-rule";

interface RuleRowWithCategories {
  id: string;
  label: string;
  percentage: number;
  monthId: string;
  createdAt: Date;
  updatedAt: Date;
  categories: { id: string; label: string }[];
}

export async function updateAllocationRule(
  userId: string,
  id: string,
  input: UpdateAllocationRuleInput
): Promise<AllocationRule | null> {
  const existing = await prisma.allocationRule.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  const categoryIds =
    input.expenseCategoryIds !== undefined
      ? Array.isArray(input.expenseCategoryIds)
        ? input.expenseCategoryIds.filter((id) => typeof id === "string" && id)
        : []
      : undefined;

  const updated = (await prisma.allocationRule.update({
    where: { id },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(input.percentage != null && {
        percentage: Math.min(100, Math.max(0, input.percentage)),
      }),
      ...(categoryIds !== undefined && {
        categories: { set: categoryIds.map((cid) => ({ id: cid })) },
      }),
    },
    include: {
      categories: { select: { id: true, label: true } },
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- include categories jusqu'à régénération du client Prisma
  } as any)) as unknown as RuleRowWithCategories;

  return {
    id: updated.id,
    label: updated.label,
    percentage: updated.percentage,
    monthId: updated.monthId,
    categoryIds: updated.categories.map((c) => c.id),
    categories: updated.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
