import { prisma } from "@/lib/db";
import type { PlannedExpense } from "../types/planned-expense";

export async function getPlannedExpenses(
  userId: string
): Promise<PlannedExpense[]> {
  const rows = await prisma.plannedExpense.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    estimatedAmount: r.estimatedAmount,
    dueDate: r.dueDate.toISOString().slice(0, 10),
    isRecurring: r.isRecurring,
    recurrenceInterval: r.recurrenceInterval,
    isDone: r.isDone,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
