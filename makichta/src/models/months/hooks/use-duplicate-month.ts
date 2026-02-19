"use client";

import { useCallback, useState } from "react";
import type { DuplicateMonthResult } from "../services/duplicate-month";

export function useDuplicateMonth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duplicate = useCallback(
    async (
      sourceMonth: string,
      targetMonth: string,
      includeRevenues: boolean = false
    ): Promise<DuplicateMonthResult | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/months/duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceMonth,
            targetMonth,
            includeRevenues,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Erreur lors de la duplication");
          return null;
        }
        return data as DuplicateMonthResult;
      } catch {
        setError("Erreur réseau");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { duplicate, isLoading, error };
}
