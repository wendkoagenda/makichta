import { prisma } from "@/lib/db";
import type {
  CreateSavingProjectInput,
  SavingProject,
} from "../types/saving-project";

interface SavingProjectRow {
  id: string;
  label: string;
  targetAmount: number | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function createSavingProject(
  userId: string,
  input: CreateSavingProjectInput,
): Promise<SavingProject> {
  const row = await (prisma as unknown as { savingProject: { create: (args: object) => Promise<SavingProjectRow> } }).savingProject.create({
    data: {
      userId,
      label: input.label.trim(),
      targetAmount:
        input.targetAmount != null && input.targetAmount >= 0
          ? input.targetAmount
          : null,
      deadline: input.deadline ? new Date(input.deadline) : null,
    },
  });

  return {
    id: row.id,
    label: row.label,
    targetAmount: row.targetAmount != null ? Number(row.targetAmount) : null,
    deadline: row.deadline?.toISOString().slice(0, 10) ?? null,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
