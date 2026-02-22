import { prisma } from "@/lib/db";
import type {
  CreateSavingGoalInput,
  SavingGoal,
} from "../types/saving-goal";

export async function createSavingGoal(
  userId: string,
  input: CreateSavingGoalInput
): Promise<SavingGoal> {
  const savingType = input.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET";
  const row = await prisma.savingGoal.create({
    data: {
      userId,
      label: input.label,
      savingType,
      targetAmount: Math.max(0, input.targetAmount),
      deadline: input.deadline ? new Date(input.deadline) : null,
      priority: input.priority ?? "MEDIUM",
      ...(input.projectId != null && input.projectId !== "" && { projectId: input.projectId }),
    },
  });

  return {
    id: row.id,
    label: row.label,
    savingType: row.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET",
    targetAmount: Number(row.targetAmount),
    currentAmount: Number(row.currentAmount),
    status: (row.status === "COMPLETED" ? "COMPLETED" : "ACTIVE") as "ACTIVE" | "COMPLETED",
    deadline: row.deadline?.toISOString().slice(0, 10) ?? null,
    priority: row.priority as "HIGH" | "MEDIUM" | "LOW",
    projectId: row.projectId ?? undefined,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
