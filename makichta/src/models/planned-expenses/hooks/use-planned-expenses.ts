"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setPlannedExpenses,
  addPlannedExpense,
  updatePlannedExpense,
  removePlannedExpense,
  setLoading,
} from "@/store/slices/planning-slice";
import type { PlannedExpense } from "../types/planned-expense";
import type { CreatePlannedExpenseInput } from "../types/planned-expense";

export function usePlannedExpenses() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.planning.plannedExpenses);
  const isLoading = useAppSelector((state) => state.planning.isLoading);

  const fetchItems = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await fetch("/api/planned-expenses");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: PlannedExpense[] = await res.json();
      dispatch(setPlannedExpenses(data));
    } catch {
      dispatch(setPlannedExpenses([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createItem = useCallback(
    async (input: CreatePlannedExpenseInput): Promise<PlannedExpense | null> => {
      const res = await fetch("/api/planned-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: PlannedExpense = await res.json();
      dispatch(addPlannedExpense(data));
      return data;
    },
    [dispatch]
  );

  const updateItem = useCallback(
    async (id: string, updates: { isDone?: boolean }): Promise<PlannedExpense | null> => {
      const res = await fetch(`/api/planned-expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      const data: PlannedExpense = await res.json();
      dispatch(updatePlannedExpense(data));
      return data;
    },
    [dispatch]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/planned-expenses/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removePlannedExpense(id));
      return true;
    },
    [dispatch]
  );

  return { items, isLoading, fetchItems, createItem, updateItem, deleteItem };
}
