"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/store";
import { convertFromUsdt, formatAmount } from "@/lib/currency/convert";
import type { ExchangeRates } from "@/lib/currency/exchange-rates";

export function useCurrency() {
  const currency = useAppSelector((state) => state.settings.settings.currency);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data) => {
        setRates(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const convertAndFormat = useCallback(
    (amountInUsdt: number): string => {
      if (!rates) {
        return `${amountInUsdt.toFixed(2)} USDT`;
      }

      const converted = convertFromUsdt(amountInUsdt, currency, rates);
      return formatAmount(converted, currency);
    },
    [currency, rates]
  );

  const convert = useCallback(
    (amountInUsdt: number): number => {
      if (!rates) return amountInUsdt;
      return convertFromUsdt(amountInUsdt, currency, rates);
    },
    [currency, rates]
  );

  return {
    currency,
    rates,
    isLoading,
    convertAndFormat,
    convert,
  };
}
