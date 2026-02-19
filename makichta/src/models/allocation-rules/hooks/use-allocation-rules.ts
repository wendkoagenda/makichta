"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setRules,
  addRule,
  updateRule,
  removeRule,
  setLoading,
} from "@/store/slices/allocations-slice";
import type { AllocationRule } from "../types/allocation-rule";
import type { CreateAllocationRuleInput } from "../types/allocation-rule";

export function useAllocationRules() {
  const dispatch = useAppDispatch();
  const rules = useAppSelector((state) => state.allocations.rules);
  const isLoading = useAppSelector((state) => state.allocations.isLoading);

  const fetchRules = useCallback(
    async (monthId: string) => {
      dispatch(setLoading(true));
      try {
        const url = monthId
          ? `/api/allocation-rules?monthId=${encodeURIComponent(monthId)}`
          : "/api/allocation-rules";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: AllocationRule[] = await res.json();
        dispatch(setRules(data));
      } catch {
        dispatch(setRules([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const createRule = useCallback(
    async (input: CreateAllocationRuleInput): Promise<AllocationRule | null> => {
      const res = await fetch("/api/allocation-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: AllocationRule = await res.json();
      dispatch(addRule(data));
      return data;
    },
    [dispatch]
  );

  const updateRuleById = useCallback(
    async (
      id: string,
      input: Partial<CreateAllocationRuleInput>
    ): Promise<AllocationRule | null> => {
      const res = await fetch(`/api/allocation-rules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: AllocationRule = await res.json();
      dispatch(updateRule(data));
      return data;
    },
    [dispatch]
  );

  const deleteRule = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/allocation-rules/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      dispatch(removeRule(id));
      return true;
    },
    [dispatch]
  );

  const seedDefaults = useCallback(
    async (monthId: string): Promise<AllocationRule[] | null> => {
      const res = await fetch("/api/allocation-rules/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthId: monthId || undefined }),
      });
      if (!res.ok) return null;
      const data: AllocationRule[] = await res.json();
      if (data.length > 0) dispatch(setRules(data));
      return data;
    },
    [dispatch]
  );

  return {
    rules,
    isLoading,
    fetchRules,
    createRule,
    updateRule: updateRuleById,
    deleteRule,
    seedDefaults,
  };
}
