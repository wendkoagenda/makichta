import { prisma } from "@/lib/db";

export async function deletePlannedExpense(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.plannedExpense.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
