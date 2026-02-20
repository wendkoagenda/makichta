"use client";

import { useCallback, useState } from "react";
import type { Liability } from "../types/liability";
import type { CreateLiabilityInput } from "../types/liability";

export function useLiabilities() {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLiabilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/liabilities");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: Liability[] = await res.json();
      setLiabilities(data);
    } catch {
      setLiabilities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLiability = useCallback(
    async (input: CreateLiabilityInput): Promise<Liability | null> => {
      const res = await fetch("/api/liabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) return null;
      const data: Liability = await res.json();
      setLiabilities((prev) => [data, ...prev]);
      return data;
    },
    []
  );

  const deleteLiability = useCallback(async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/liabilities/${id}`, { method: "DELETE" });
    if (!res.ok) return false;
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
    return true;
  }, []);

  return {
    liabilities,
    isLoading,
    fetchLiabilities,
    createLiability,
    deleteLiability,
  };
}
