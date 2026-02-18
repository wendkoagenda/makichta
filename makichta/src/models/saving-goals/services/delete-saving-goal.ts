import { prisma } from "@/lib/db";

export async function deleteSavingGoal(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.savingGoal.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
