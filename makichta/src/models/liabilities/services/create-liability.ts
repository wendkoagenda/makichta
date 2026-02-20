import { prisma } from "@/lib/db";
import type { CreateLiabilityInput, Liability } from "../types/liability";

export async function createLiability(
  userId: string,
  input: CreateLiabilityInput
): Promise<Liability> {
  const row = await prisma.liability.create({
    data: {
      userId,
      label: input.label.trim(),
      amount: Math.max(0, input.amount),
      date: new Date(input.date),
      note: input.note?.trim() || null,
    },
  });

  return {
    id: row.id,
    label: row.label,
    amount: row.amount,
    date: row.date.toISOString().slice(0, 10),
    note: row.note,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
