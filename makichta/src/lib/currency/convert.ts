import type { ExchangeRates } from "./exchange-rates";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USDT: "USDT",
  USD: "$",
  EUR: "€",
  XOF: "FCFA",
};

export function convertFromUsdt(
  amount: number,
  targetCurrency: string,
  rates: ExchangeRates
): number {
  const rate = rates[targetCurrency as keyof ExchangeRates] ?? rates.USD;
  return amount * rate;
}

export function formatAmount(
  amount: number,
  currency: string,
  options?: { locale?: string; maximumFractionDigits?: number }
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const locale = options?.locale ?? "fr-FR";
  const maxFraction = options?.maximumFractionDigits ?? 2;

  if (currency === "USDT") {
    return `${amount.toLocaleString(locale, {
      minimumFractionDigits: maxFraction,
      maximumFractionDigits: maxFraction,
    })} ${symbol}`;
  }

  if (currency === "XOF" || currency === "FCFA") {
    return `${amount.toLocaleString(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} ${symbol}`;
  }

  return `${symbol}${amount.toLocaleString(locale, {
    minimumFractionDigits: maxFraction,
    maximumFractionDigits: maxFraction,
  })}`;
}
