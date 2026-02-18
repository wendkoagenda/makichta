import { prisma } from "@/lib/db";
import type { UpdateExpenseInput, Expense } from "../types/expense";

export async function updateExpense(
  userId: string,
  id: string,
  input: UpdateExpenseInput
): Promise<Expense | null> {
  const row = await prisma.expense.updateMany({
    where: { id, userId },
    data: {
      ...(input.categoryId != null && { categoryId: input.categoryId }),
      ...(input.amount != null && { amount: input.amount }),
      ...(input.date != null && { date: new Date(input.date) }),
      ...(input.description !== undefined && { description: input.description }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.expense.findUnique({ where: { id } });
  if (!updated) return null;

  return {
    id: updated.id,
    categoryId: updated.categoryId,
    amount: updated.amount,
    date: updated.date.toISOString().slice(0, 10),
    description: updated.description,
    createdAt: updated.createdAt?.toISOString(),
  };
}
