import { prisma } from "@/lib/db";
import type {
  CreatePlannedExpenseInput,
  PlannedExpense,
} from "../types/planned-expense";

export async function createPlannedExpense(
  userId: string,
  input: CreatePlannedExpenseInput
): Promise<PlannedExpense> {
  const row = await prisma.plannedExpense.create({
    data: {
      userId,
      label: input.label,
      estimatedAmount: Math.max(0, input.estimatedAmount),
      dueDate: new Date(input.dueDate),
      isRecurring: input.isRecurring ?? false,
      recurrenceInterval: input.recurrenceInterval ?? null,
    },
  });

  return {
    id: row.id,
    label: row.label,
    estimatedAmount: row.estimatedAmount,
    dueDate: row.dueDate.toISOString().slice(0, 10),
    isRecurring: row.isRecurring,
    recurrenceInterval: row.recurrenceInterval,
    isDone: row.isDone,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
