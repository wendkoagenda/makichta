import { prisma } from "@/lib/db";

export async function deleteRevenueSource(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.revenueSource.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
