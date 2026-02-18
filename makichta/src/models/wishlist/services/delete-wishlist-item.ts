import { prisma } from "@/lib/db";

export async function deleteWishlistItem(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.wishlistItem.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
