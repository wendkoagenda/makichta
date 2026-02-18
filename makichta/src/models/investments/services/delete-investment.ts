import { prisma } from "@/lib/db";

export async function deleteInvestment(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.investment.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
