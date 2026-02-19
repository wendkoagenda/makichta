import { prisma } from "@/lib/db";
import type { ExpenseCategory } from "../types/expense-category";

interface CategoryRowWithRules {
  id: string;
  label: string;
  type: string;
  monthlyBudget: number;
  budgetPercent: number | null;
  monthId: string;
  allocationRules: { id: string; label: string }[];
}

export async function getExpenseCategories(
  userId: string,
  monthId: string
): Promise<ExpenseCategory[]> {
  const rows = (await prisma.expenseCategory.findMany({
    where: { userId, monthId },
    orderBy: { label: "asc" },
    include: {
      allocationRules: { select: { id: true, label: true } },
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- include allocationRules
  } as any)) as unknown as CategoryRowWithRules[];

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    type: r.type as "FIXED" | "VARIABLE",
    monthlyBudget: r.monthlyBudget,
    budgetPercent: r.budgetPercent,
    monthId: r.monthId,
    allocationRules: r.allocationRules?.map((rule) => ({
      id: rule.id,
      label: rule.label,
    })),
  }));
}
