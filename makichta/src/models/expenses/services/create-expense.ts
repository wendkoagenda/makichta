import { prisma } from "@/lib/db";
import type { CreateExpenseInput, Expense } from "../types/expense";

export async function createExpense(
  userId: string,
  input: CreateExpenseInput
): Promise<Expense> {
  const row = await prisma.expense.create({
    data: {
      userId,
      categoryId: input.categoryId,
      amount: input.amount,
      date: new Date(input.date),
      description: input.description ?? "",
    },
  });

  return {
    id: row.id,
    categoryId: row.categoryId,
    amount: row.amount,
    date: row.date.toISOString().slice(0, 10),
    description: row.description,
    createdAt: row.createdAt?.toISOString(),
  };
}
