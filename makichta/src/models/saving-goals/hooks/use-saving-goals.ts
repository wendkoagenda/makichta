"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setGoals,
  addGoal,
  updateGoal,
  removeGoal,
  setLoading,
} from "@/store/slices/savings-slice";
import type { SavingGoal } from "../types/saving-goal";
import type { CreateSavingGoalInput } from "../types/saving-goal";

export function useSavingGoals() {
  const dispatch = useAppDispatch();
  const goals = useAppSelector((state) => state.savings.goals);
  const isLoading = useAppSelector((state) => state.savings.isLoading);

  const fetchGoals = useCallback(
    async (projectId?: string | null, status?: "ACTIVE" | "COMPLETED") => {
      dispatch(setLoading(true));
      try {
        const params = new URLSearchParams();
        if (projectId !== undefined && projectId !== null) {
          params.set("projectId", projectId);
        }
        if (status !== undefined) {
          params.set("status", status);
        }
        const qs = params.toString();
        const url = qs ? `/api/saving-goals?${qs}` : "/api/saving-goals";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: SavingGoal[] = await res.json();
        dispatch(setGoals(data));
      } catch {
        dispatch(setGoals([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const createGoal = useCallback(
    async (input: CreateSavingGoalInput): Promise<SavingGoal | null> => {
      const res = await fetch("/api/saving-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: SavingGoal = await res.json();
      dispatch(addGoal(data));
      return data;
    },
    [dispatch]
  );

  const updateGoalById = useCallback(
    async (
      id: string,
      input: Partial<CreateSavingGoalInput>
    ): Promise<SavingGoal | null> => {
      const res = await fetch(`/api/saving-goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: SavingGoal = await res.json();
      dispatch(updateGoal(data));
      return data;
    },
    [dispatch]
  );

  const deleteGoal = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/saving-goals/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeGoal(id));
      return true;
    },
    [dispatch]
  );

  return {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal: updateGoalById,
    deleteGoal,
  };
}
