"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setSources,
  addSource,
  updateSource,
  removeSource,
  setLoading,
} from "@/store/slices/revenues-slice";
import type { RevenueSource } from "../types/revenue-source";
import type { CreateRevenueSourceInput } from "../types/revenue-source";

export function useRevenueSources() {
  const dispatch = useAppDispatch();
  const sources = useAppSelector((state) => state.revenues.sources);
  const isLoading = useAppSelector((state) => state.revenues.isLoading);

  const fetchSources = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch("/api/revenue-sources");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: RevenueSource[] = await res.json();
      dispatch(setSources(data));
    } catch {
      dispatch(setSources([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createSource = useCallback(
    async (input: CreateRevenueSourceInput): Promise<RevenueSource | null> => {
      const res = await fetch("/api/revenue-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: RevenueSource = await res.json();
      dispatch(addSource(data));
      return data;
    },
    [dispatch]
  );

  const updateSourceById = useCallback(
    async (
      id: string,
      input: Partial<CreateRevenueSourceInput>
    ): Promise<RevenueSource | null> => {
      const res = await fetch(`/api/revenue-sources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: RevenueSource = await res.json();
      dispatch(updateSource(data));
      return data;
    },
    [dispatch]
  );

  const deleteSource = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/revenue-sources/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      dispatch(removeSource(id));
      return true;
    },
    [dispatch]
  );

  return {
    sources,
    isLoading,
    fetchSources,
    createSource,
    updateSource: updateSourceById,
    deleteSource,
  };
}
