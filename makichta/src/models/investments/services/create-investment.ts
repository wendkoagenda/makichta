import { prisma } from "@/lib/db";
import type { CreateInvestmentInput, Investment } from "../types/investment";

export async function createInvestment(
  userId: string,
  input: CreateInvestmentInput
): Promise<Investment> {
  const row = await prisma.investment.create({
    data: {
      userId,
      type: input.type,
      amount: input.amount,
      date: new Date(input.date),
      description: input.description ?? "",
    },
  });

  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    date: row.date.toISOString().slice(0, 10),
    description: row.description,
    createdAt: row.createdAt?.toISOString(),
  };
}
