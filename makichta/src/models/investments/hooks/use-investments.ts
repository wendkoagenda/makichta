"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setInvestments,
  addInvestment,
  removeInvestment,
  setLoading,
} from "@/store/slices/investments-slice";
import type { Investment } from "../types/investment";
import type { CreateInvestmentInput } from "../types/investment";

export function useInvestments(type?: string) {
  const dispatch = useAppDispatch();
  const investments = useAppSelector((state) => state.investments.investments);
  const isLoading = useAppSelector((state) => state.investments.isLoading);

  const fetchInvestments = useCallback(
    async (typeFilter?: string) => {
      dispatch(setLoading(true));
      try {
        const params = new URLSearchParams();
        const t = typeFilter ?? type;
        if (t) params.set("type", t);
        const url = `/api/investments${params.toString() ? `?${params}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur réseau");
        const data: Investment[] = await res.json();
        dispatch(setInvestments(data));
      } catch {
        dispatch(setInvestments([]));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, type]
  );

  const createInvestmentFn = useCallback(
    async (input: CreateInvestmentInput): Promise<Investment | null> => {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Investment = await res.json();
      dispatch(addInvestment(data));
      return data;
    },
    [dispatch]
  );

  const deleteInvestmentFn = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/investments/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      dispatch(removeInvestment(id));
      return true;
    },
    [dispatch]
  );

  return {
    investments,
    isLoading,
    fetchInvestments,
    createInvestment: createInvestmentFn,
    deleteInvestment: deleteInvestmentFn,
  };
}
