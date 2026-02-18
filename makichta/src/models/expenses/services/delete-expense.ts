import { prisma } from "@/lib/db";

export async function deleteExpense(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.expense.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
