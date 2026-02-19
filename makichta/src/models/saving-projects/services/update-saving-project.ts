import { prisma } from "@/lib/db";
import type {
  UpdateSavingProjectInput,
  SavingProject,
} from "../types/saving-project";

export async function updateSavingProject(
  userId: string,
  id: string,
  input: UpdateSavingProjectInput
): Promise<SavingProject | null> {
  const row = await prisma.savingProject.updateMany({
    where: { id, userId },
    data: {
      ...(input.label != null && { label: input.label.trim() }),
      ...(input.targetAmount !== undefined && {
        targetAmount:
          input.targetAmount != null && input.targetAmount >= 0
            ? input.targetAmount
            : null,
      }),
      ...(input.deadline !== undefined && {
        deadline: input.deadline ? new Date(input.deadline) : null,
      }),
    },
  });

  if (row.count === 0) return null;

  const updated = await prisma.savingProject.findUnique({ where: { id } });
  if (!updated) return null;

  return {
    id: updated.id,
    label: updated.label,
    targetAmount: updated.targetAmount != null ? Number(updated.targetAmount) : null,
    deadline: updated.deadline?.toISOString().slice(0, 10) ?? null,
    createdAt: updated.createdAt?.toISOString(),
    updatedAt: updated.updatedAt?.toISOString(),
  };
}
