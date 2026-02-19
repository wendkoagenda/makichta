import { prisma } from "@/lib/db";
import type { SavingProject } from "../types/saving-project";

interface SavingProjectRow {
  id: string;
  label: string;
  targetAmount: number | null;
  deadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSavingProjects(
  userId: string
): Promise<SavingProject[]> {
  const rows = await (prisma as unknown as { savingProject: { findMany: (args: object) => Promise<SavingProjectRow[]> } }).savingProject.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    targetAmount: r.targetAmount != null ? Number(r.targetAmount) : null,
    deadline: r.deadline?.toISOString().slice(0, 10) ?? null,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
