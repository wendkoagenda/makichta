import { prisma } from "@/lib/db";

export async function deleteAllocationRule(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.allocationRule.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
