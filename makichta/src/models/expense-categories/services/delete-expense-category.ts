import { prisma } from "@/lib/db";

export async function deleteExpenseCategory(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.expenseCategory.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
