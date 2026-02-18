import { prisma } from "@/lib/db";
import type { PlannedExpense } from "../types/planned-expense";

export async function updatePlannedExpense(
  userId: string,
  id: string,
  updates: { isDone?: boolean; label?: string; estimatedAmount?: number; dueDate?: string }
): Promise<PlannedExpense | null> {
  const data: Record<string, unknown> = {};
  if (updates.isDone !== undefined) data.isDone = updates.isDone;
  if (updates.label != null) data.label = updates.label;
  if (updates.estimatedAmount != null) data.estimatedAmount = Math.max(0, updates.estimatedAmount);
  if (updates.dueDate != null) data.dueDate = new Date(updates.dueDate);

  const row = await prisma.plannedExpense.updateMany({
    where: { id, userId },
    data,
  });
  if (row.count === 0) return null;

  const updated = await prisma.plannedExpense.findUnique({ where: { id } });
  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    estimatedAmount: updated.estimatedAmount,
    dueDate: updated.dueDate.toISOString().slice(0, 10),
    isRecurring: updated.isRecurring,
    recurrenceInterval: updated.recurrenceInterval,
    isDone: updated.isDone,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
