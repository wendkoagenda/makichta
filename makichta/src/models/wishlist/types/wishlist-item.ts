export type WishlistPriority = "HIGH" | "MEDIUM" | "LOW";

export interface WishlistItem {
  id: string;
  label: string;
  estimatedCost: number;
  priority: WishlistPriority;
  url: string | null;
  savingGoalId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWishlistItemInput {
  label: string;
  estimatedCost: number;
  priority?: WishlistPriority;
  url?: string | null;
}
