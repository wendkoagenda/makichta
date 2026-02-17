import { NextResponse } from "next/server";
import { fetchExchangeRates } from "@/lib/currency/exchange-rates";

export async function GET() {
  try {
    const rates = await fetchExchangeRates();
    return NextResponse.json(rates);
  } catch {
    return NextResponse.json(
      {
        USDT: 1.0,
        USD: 1.0,
        EUR: 0.92,
        XOF: 603.5,
      },
      { status: 200 }
    );
  }
}
