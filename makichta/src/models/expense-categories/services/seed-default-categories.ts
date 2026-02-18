import { prisma } from "@/lib/db";
import { DEFAULT_EXPENSE_CATEGORIES } from "@/lib/constants";

export async function seedDefaultExpenseCategories(
  userId: string
): Promise<void> {
  const existing = await prisma.expenseCategory.count({
    where: { userId },
  });

  if (existing > 0) return;

  await prisma.expenseCategory.createMany({
    data: DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
      userId,
      label: c.label,
      type: c.type,
      monthlyBudget: 0,
    })),
  });
}
