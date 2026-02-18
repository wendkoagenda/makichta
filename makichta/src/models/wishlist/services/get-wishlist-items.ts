import { prisma } from "@/lib/db";
import type { WishlistItem } from "../types/wishlist-item";

export async function getWishlistItems(
  userId: string
): Promise<WishlistItem[]> {
  const rows = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    estimatedCost: r.estimatedCost,
    priority: r.priority as "HIGH" | "MEDIUM" | "LOW",
    url: r.url,
    savingGoalId: r.savingGoalId,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
