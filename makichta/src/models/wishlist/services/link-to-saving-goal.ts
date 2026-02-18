import { prisma } from "@/lib/db";
import type { WishlistItem } from "../types/wishlist-item";

export async function linkWishlistItemToSavingGoal(
  userId: string,
  itemId: string,
  savingGoalId: string | null
): Promise<WishlistItem | null> {
  const item = await prisma.wishlistItem.findFirst({
    where: { id: itemId, userId },
  });
  if (!item) return null;

  const goal = savingGoalId
    ? await prisma.savingGoal.findFirst({
        where: { id: savingGoalId, userId },
      })
    : true;
  if (savingGoalId && !goal) return null;

  const updated = await prisma.wishlistItem.update({
    where: { id: itemId },
    data: { savingGoalId },
  });

  return {
    id: updated.id,
    label: updated.label,
    estimatedCost: updated.estimatedCost,
    priority: updated.priority as "HIGH" | "MEDIUM" | "LOW",
    url: updated.url,
    savingGoalId: updated.savingGoalId,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
