"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setLoading,
} from "@/store/slices/expenses-slice";
import type { Expense } from "../types/expense";
import type { CreateExpenseInput } from "../types/expense";
import type { ExpenseWithCategory } from "../services/get-expenses";

export function useExpenses(month?: string) {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const isLoading = useAppSelector((state) => state.expenses.isLoading);

  const fetchExpenses = useCallback(
    async (categoryId?: string) => {
      dispatch(setLoading(true));
      try {
        const params = new URLSearchParams();
        if (categoryId) params.set("categoryId", categoryId);
        if (month) params.set("month", month);
        const res = await fetch(`/api/expenses?${params}`);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: ExpenseWithCategory[] = await res.json();
        dispatch(
          setExpenses(
            data.map((e) => ({
              id: e.id,
              categoryId: e.categoryId,
              amount: e.amount,
              date: e.date,
              description: e.description,
              categoryLabel: e.categoryLabel,
            }))
          )
        );
      } catch {
        dispatch(setExpenses([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, month]
  );

  const createExpenseFn = useCallback(
    async (input: CreateExpenseInput): Promise<Expense | null> => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Expense = await res.json();
      dispatch(addExpense(data));
      return data;
    },
    [dispatch]
  );

  const updateExpenseById = useCallback(
    async (
      id: string,
      input: Partial<CreateExpenseInput>
    ): Promise<Expense | null> => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Expense = await res.json();
      dispatch(updateExpense(data));
      return data;
    },
    [dispatch]
  );

  const deleteExpenseFn = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeExpense(id));
      return true;
    },
    [dispatch]
  );

  return {
    expenses,
    isLoading,
    fetchExpenses,
    createExpense: createExpenseFn,
    updateExpense: updateExpenseById,
    deleteExpense: deleteExpenseFn,
  };
}
