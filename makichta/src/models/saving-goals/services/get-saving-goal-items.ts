import { prisma } from "@/lib/db";
import type { SavingGoalItem } from "../types/saving-goal-item";

export async function getSavingGoalItems(
  userId: string,
  savingGoalId: string
): Promise<SavingGoalItem[]> {
  const goal = await prisma.savingGoal.findFirst({
    where: { id: savingGoalId, userId },
    include: { items: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] } },
  });
  if (!goal) return [];

  return goal.items.map((r) => ({
    id: r.id,
    savingGoalId: r.savingGoalId,
    title: r.title,
    url: r.url ?? null,
    amount: Number(r.amount),
    description: r.description ?? null,
    order: r.order ?? null,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
