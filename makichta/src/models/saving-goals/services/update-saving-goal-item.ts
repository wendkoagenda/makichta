import { prisma } from "@/lib/db";
import type {
  SavingGoalItem,
  UpdateSavingGoalItemInput,
} from "../types/saving-goal-item";

export async function updateSavingGoalItem(
  userId: string,
  itemId: string,
  input: UpdateSavingGoalItemInput
): Promise<SavingGoalItem | null> {
  const existing = await prisma.savingGoalItem.findFirst({
    where: { id: itemId },
    include: { savingGoal: true },
  });
  if (!existing || existing.savingGoal.userId !== userId) return null;

  const updated = await prisma.savingGoalItem.update({
    where: { id: itemId },
    data: {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.url !== undefined && { url: input.url?.trim() || null }),
      ...(input.amount !== undefined && {
        amount: Math.max(0, input.amount),
      }),
      ...(input.description !== undefined && {
        description: input.description?.trim() || null,
      }),
      ...(input.order !== undefined && { order: input.order }),
    },
  });

  return {
    id: updated.id,
    savingGoalId: updated.savingGoalId,
    title: updated.title,
    url: updated.url ?? null,
    amount: Number(updated.amount),
    description: updated.description ?? null,
    order: updated.order ?? null,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
