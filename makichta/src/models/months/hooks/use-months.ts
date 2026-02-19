"use client";

import { useCallback, useEffect, useState } from "react";
import type { Month } from "../types/month";

export function useMonths() {
  const [months, setMonths] = useState<Month[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonths = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/months");
      if (!res.ok) throw new Error("Erreur réseau");
      const data: Month[] = await res.json();
      setMonths(data);
    } catch {
      setMonths([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  return { months, isLoading, refetch: fetchMonths };
}
