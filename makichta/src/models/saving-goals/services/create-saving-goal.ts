import { prisma } from "@/lib/db";
import type {
  CreateSavingGoalInput,
  SavingGoal,
} from "../types/saving-goal";

export async function createSavingGoal(
  userId: string,
  input: CreateSavingGoalInput
): Promise<SavingGoal> {
  const row = await prisma.savingGoal.create({
    data: {
      userId,
      label: input.label,
      targetAmount: Math.max(0, input.targetAmount),
      deadline: input.deadline ? new Date(input.deadline) : null,
      priority: input.priority ?? "MEDIUM",
    },
  });

  return {
    id: row.id,
    label: row.label,
    targetAmount: row.targetAmount,
    currentAmount: row.currentAmount,
    deadline: row.deadline?.toISOString().slice(0, 10) ?? null,
    priority: row.priority as "HIGH" | "MEDIUM" | "LOW",
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
