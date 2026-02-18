import { prisma } from "@/lib/db";

export async function deleteRevenue(userId: string, id: string): Promise<boolean> {
  const result = await prisma.revenue.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
