import { prisma } from "@/lib/db";
import type { SavingGoal } from "../types/saving-goal";

export async function getSavingGoals(userId: string): Promise<SavingGoal[]> {
  const rows = await prisma.savingGoal.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    targetAmount: r.targetAmount,
    currentAmount: r.currentAmount,
    deadline: r.deadline?.toISOString().slice(0, 10) ?? null,
    priority: r.priority as "HIGH" | "MEDIUM" | "LOW",
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
