import { prisma } from "@/lib/db";

export async function deleteLiability(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.liability.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
