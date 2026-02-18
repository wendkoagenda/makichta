"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAssets,
  addAsset,
  removeAsset,
  setLoading,
} from "@/store/slices/depreciation-slice";
import type { Asset } from "../types/asset";
import type { CreateAssetInput } from "../types/asset";

export function useAssets() {
  const dispatch = useAppDispatch();
  const assets = useAppSelector((state) => state.depreciation.assets);
  const isLoading = useAppSelector((state) => state.depreciation.isLoading);

  const fetchAssets = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch("/api/assets");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: Asset[] = await res.json();
      dispatch(setAssets(data));
    } catch {
      dispatch(setAssets([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createAssetFn = useCallback(
    async (input: CreateAssetInput): Promise<Asset | null> => {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Asset = await res.json();
      dispatch(addAsset(data));
      return data;
    },
    [dispatch]
  );

  const deleteAssetFn = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeAsset(id));
      return true;
    },
    [dispatch]
  );

  return {
    assets,
    isLoading,
    fetchAssets,
    createAsset: createAssetFn,
    deleteAsset: deleteAssetFn,
  };
}
