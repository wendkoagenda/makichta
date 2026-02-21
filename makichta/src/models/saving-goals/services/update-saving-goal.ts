import { prisma } from "@/lib/db";
import type {
  UpdateSavingGoalInput,
  SavingGoal,
} from "../types/saving-goal";

export async function updateSavingGoal(
  userId: string,
  id: string,
  input: UpdateSavingGoalInput
): Promise<SavingGoal | null> {
  const row = await prisma.savingGoal.updateMany({
    where: { id, userId },
    data: {
      ...(input.label != null && { label: input.label }),
      ...(input.savingType != null && {
        savingType: input.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET",
      }),
      ...(input.targetAmount != null && {
        targetAmount: Math.max(0, input.targetAmount),
      }),
      ...(input.deadline !== undefined && {
        deadline: input.deadline ? new Date(input.deadline) : null,
      }),
      ...(input.priority != null && { priority: input.priority }),
      ...(input.projectId !== undefined && {
        projectId: input.projectId == null || input.projectId === "" ? null : input.projectId,
      }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.savingGoal.findUnique({
    where: { id },
    include: { project: { select: { label: true } } },
  });
  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    savingType: updated.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET",
    targetAmount: Number(updated.targetAmount),
    currentAmount: Number(updated.currentAmount),
    deadline: updated.deadline?.toISOString().slice(0, 10) ?? null,
    priority: updated.priority as "HIGH" | "MEDIUM" | "LOW",
    projectId: updated.projectId ?? undefined,
    projectLabel: updated.project?.label ?? undefined,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
