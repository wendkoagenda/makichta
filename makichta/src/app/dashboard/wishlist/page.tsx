"use client";

import { WishlistList } from "@/models/wishlist/components/wishlist-list";

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Wishlist</h1>
        <p className="text-muted-foreground">
          Listez vos achats souhaités et convertissez-les en objectifs
          d&apos;épargne
        </p>
      </div>
      <WishlistList />
    </div>
  );
}
