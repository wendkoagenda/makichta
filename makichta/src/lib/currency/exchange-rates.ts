export interface ExchangeRates {
  USDT: number;
  USD: number;
  EUR: number;
  XOF: number;
}

const XOF_PER_EUR = 655.957;
const CACHE_TTL_MS = 60 * 60 * 1000;

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp = 0;

const FALLBACK_RATES: ExchangeRates = {
  USDT: 1.0,
  USD: 1.0,
  EUR: 0.92,
  XOF: 603.5,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  if (cachedRates && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedRates;
  }

  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );

    if (!res.ok) throw new Error("Exchange rate API error");

    const data = await res.json();
    const rates = data.rates as Record<string, number>;

    const usdToEur = rates.EUR ?? FALLBACK_RATES.EUR;
    const usdToXof = usdToEur * XOF_PER_EUR;

    cachedRates = {
      USDT: 1.0,
      USD: 1.0,
      EUR: usdToEur,
      XOF: usdToXof,
    };

    cacheTimestamp = Date.now();
    return cachedRates;
  } catch {
    return FALLBACK_RATES;
  }
}
