import { prisma } from "@/lib/db";

export async function deleteSavingGoalItem(
  userId: string,
  itemId: string
): Promise<boolean> {
  const item = await prisma.savingGoalItem.findFirst({
    where: { id: itemId },
    include: { savingGoal: true },
  });
  if (!item || item.savingGoal.userId !== userId) return false;

  await prisma.savingGoalItem.delete({
    where: { id: itemId },
  });
  return true;
}
