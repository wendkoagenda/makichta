import { prisma } from "@/lib/db";
import type {
  CreateSavingGoalItemInput,
  SavingGoalItem,
} from "../types/saving-goal-item";

export async function createSavingGoalItem(
  userId: string,
  input: CreateSavingGoalItemInput
): Promise<SavingGoalItem | null> {
  const goal = await prisma.savingGoal.findFirst({
    where: { id: input.savingGoalId, userId },
  });
  if (!goal) return null;

  const item = await prisma.savingGoalItem.create({
    data: {
      savingGoalId: input.savingGoalId,
      title: input.title.trim(),
      url: input.url?.trim() || null,
      amount: Math.max(0, input.amount),
      description: input.description?.trim() || null,
      order: input.order ?? null,
    },
  });

  return {
    id: item.id,
    savingGoalId: item.savingGoalId,
    title: item.title,
    url: item.url ?? null,
    amount: Number(item.amount),
    description: item.description ?? null,
    order: item.order ?? null,
    createdAt: item.createdAt?.toISOString(),
    updatedAt: item.updatedAt?.toISOString(),
  };
}
