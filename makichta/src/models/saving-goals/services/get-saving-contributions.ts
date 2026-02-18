import { prisma } from "@/lib/db";
import type { SavingContribution } from "../types/saving-contribution";

export async function getSavingContributions(
  savingGoalId: string
): Promise<SavingContribution[]> {
  const rows = await prisma.savingContribution.findMany({
    where: { savingGoalId },
    orderBy: { date: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    savingGoalId: r.savingGoalId,
    amount: r.amount,
    date: r.date.toISOString().slice(0, 10),
    isAutomatic: r.isAutomatic,
    createdAt: r.createdAt?.toISOString(),
  }));
}
