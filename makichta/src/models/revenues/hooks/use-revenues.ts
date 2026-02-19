"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setRevenues,
  addRevenue,
  updateRevenue,
  removeRevenue,
  setLoading,
} from "@/store/slices/revenues-slice";
import type { Revenue } from "../types/revenue";
import type { CreateRevenueInput } from "../types/revenue";

interface UseRevenuesOptions {
  sourceId?: string;
  monthId?: string; // YYYY-MM
}

export function useRevenues(options: UseRevenuesOptions = {}) {
  const dispatch = useAppDispatch();
  const revenues = useAppSelector((state) => state.revenues.revenues);
  const isLoading = useAppSelector((state) => state.revenues.isLoading);

  const fetchRevenues = useCallback(
    async (overrides?: { sourceId?: string; monthId?: string }) => {
      dispatch(setLoading(true));
      try {
        const params = new URLSearchParams();
        const srcId = overrides?.sourceId ?? options.sourceId;
        const m = overrides?.monthId ?? options.monthId;
        if (srcId) params.set("sourceId", srcId);
        if (m) params.set("monthId", m);
        const url = `/api/revenues${params.toString() ? `?${params}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: Revenue[] = await res.json();
        dispatch(setRevenues(data));
      } catch {
        dispatch(setRevenues([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, options.sourceId, options.monthId]
  );

  const createRevenue = useCallback(
    async (input: CreateRevenueInput): Promise<Revenue | null> => {
      const res = await fetch("/api/revenues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Revenue = await res.json();
      dispatch(addRevenue(data));
      return data;
    },
    [dispatch]
  );

  const updateRevenueById = useCallback(
    async (id: string, input: Partial<CreateRevenueInput>): Promise<Revenue | null> => {
      const res = await fetch(`/api/revenues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Revenue = await res.json();
      dispatch(updateRevenue(data));
      return data;
    },
    [dispatch]
  );

  const deleteRevenue = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/revenues/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeRevenue(id));
      return true;
    },
    [dispatch]
  );

  return {
    revenues,
    isLoading,
    fetchRevenues,
    createRevenue,
    updateRevenue: updateRevenueById,
    deleteRevenue,
  };
}
