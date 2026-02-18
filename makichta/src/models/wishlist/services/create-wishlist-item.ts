import { prisma } from "@/lib/db";
import type {
  CreateWishlistItemInput,
  WishlistItem,
} from "../types/wishlist-item";

export async function createWishlistItem(
  userId: string,
  input: CreateWishlistItemInput
): Promise<WishlistItem> {
  const row = await prisma.wishlistItem.create({
    data: {
      userId,
      label: input.label,
      estimatedCost: Math.max(0, input.estimatedCost),
      priority: input.priority ?? "MEDIUM",
      url: input.url || null,
    },
  });

  return {
    id: row.id,
    label: row.label,
    estimatedCost: row.estimatedCost,
    priority: row.priority as "HIGH" | "MEDIUM" | "LOW",
    url: row.url,
    savingGoalId: row.savingGoalId,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
