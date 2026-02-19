"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setLoading,
} from "@/store/slices/expenses-slice";
import type { ExpenseCategory } from "../types/expense-category";
import type { CreateExpenseCategoryInput } from "../types/expense-category";

export function useExpenseCategories() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.expenses.categories);
  const isLoading = useAppSelector((state) => state.expenses.isLoading);

  const fetchCategories = useCallback(
    async (monthId: string) => {
      dispatch(setLoading(true));
      try {
        const url = monthId
          ? `/api/expense-categories?monthId=${encodeURIComponent(monthId)}`
          : "/api/expense-categories";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: ExpenseCategory[] = await res.json();
        dispatch(setCategories(data));
      } catch {
        dispatch(setCategories([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const createCategory = useCallback(
    async (input: CreateExpenseCategoryInput): Promise<ExpenseCategory | null> => {
      const res = await fetch("/api/expense-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: ExpenseCategory = await res.json();
      dispatch(addCategory(data));
      return data;
    },
    [dispatch]
  );

  const updateCategoryById = useCallback(
    async (
      id: string,
      input: Partial<CreateExpenseCategoryInput>
    ): Promise<ExpenseCategory | null> => {
      const res = await fetch(`/api/expense-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: ExpenseCategory = await res.json();
      dispatch(updateCategory(data));
      return data;
    },
    [dispatch]
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/expense-categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      dispatch(removeCategory(id));
      return true;
    },
    [dispatch]
  );

  const seedDefaults = useCallback(
    async (monthId: string): Promise<ExpenseCategory[] | null> => {
      const res = await fetch("/api/expense-categories/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthId: monthId || undefined }),
      });
      if (!res.ok) return null;
      const data: ExpenseCategory[] = await res.json();
      dispatch(setCategories(data));
      return data;
    },
    [dispatch]
  );

  return {
    categories,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory: updateCategoryById,
    deleteCategory,
    seedDefaults,
  };
}
