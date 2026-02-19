import { prisma } from "@/lib/db";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import type {
  CreateAllocationRuleInput,
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

export async function createAllocationRule(
  userId: string,
  input: CreateAllocationRuleInput
): Promise<AllocationRule> {
  const categoryIds = Array.isArray(input.expenseCategoryIds)
    ? input.expenseCategoryIds.filter((id) => typeof id === "string" && id)
    : [];
  const monthId =
    typeof input.monthId === "string" && input.monthId ? input.monthId : getCurrentMonthId();

  const row = (await prisma.allocationRule.create({
    data: {
      userId,
      label: input.label,
      percentage: Math.min(100, Math.max(0, input.percentage)),
      monthId,
      ...(categoryIds.length > 0 && {
        categories: { connect: categoryIds.map((id) => ({ id })) },
      }),
    },
    include: {
      categories: { select: { id: true, label: true } },
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- include categories
  } as any)) as unknown as RuleRowWithCategories;

  return {
    id: row.id,
    label: row.label,
    percentage: row.percentage,
    monthId: row.monthId,
    categoryIds: row.categories.map((c) => c.id),
    categories: row.categories.map((c) => ({ id: c.id, label: c.label })),
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
