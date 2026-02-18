import { prisma } from "@/lib/db";

export async function deleteAsset(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.asset.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
