import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";
import type { CreateExpenseInput, Expense } from "../types/expense";

export async function createExpense(
  userId: string,
  input: CreateExpenseInput
): Promise<Expense> {
  const date = new Date(input.date);
  const monthId = getMonthIdFromDate(date);
  const row = await prisma.expense.create({
    data: {
      userId,
      categoryId: input.categoryId,
      monthId,
      amount: input.amount,
      date,
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
