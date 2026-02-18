"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setItems,
  addItem,
  updateItem,
  removeItem,
  linkToSavingGoal,
  setLoading,
} from "@/store/slices/wishlist-slice";
import type { WishlistItem } from "../types/wishlist-item";
import type { CreateWishlistItemInput } from "../types/wishlist-item";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.wishlist.items);
  const isLoading = useAppSelector((state) => state.wishlist.isLoading);

  const fetchItems = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: WishlistItem[] = await res.json();
      dispatch(setItems(data));
    } catch {
      dispatch(setItems([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createItem = useCallback(
    async (input: CreateWishlistItemInput): Promise<WishlistItem | null> => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: WishlistItem = await res.json();
      dispatch(addItem(data));
      return data;
    },
    [dispatch]
  );

  const convertToSavingGoal = useCallback(
    async (itemId: string, savingGoalId: string): Promise<WishlistItem | null> => {
      const res = await fetch(`/api/wishlist/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savingGoalId }),
      });
      if (!res.ok) return null;
      const data: WishlistItem = await res.json();
      dispatch(linkToSavingGoal({ itemId, savingGoalId }));
      return data;
    },
    [dispatch]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeItem(id));
      return true;
    },
    [dispatch]
  );

  return { items, isLoading, fetchItems, createItem, convertToSavingGoal, deleteItem };
}
