import { prisma } from "@/lib/db";
import type { SavingGoal } from "../types/saving-goal";

export interface GetSavingGoalsOptions {
  userId: string;
  projectId?: string | null;
}

export async function getSavingGoals(
  options: GetSavingGoalsOptions | string
): Promise<SavingGoal[]> {
  const userId = typeof options === "string" ? options : options.userId;
  const projectId =
    typeof options === "string" ? undefined : options.projectId;

  const where: { userId: string; projectId?: string | null } = { userId };
  if (projectId !== undefined) {
    where.projectId = projectId;
  }

  const rows = await prisma.savingGoal.findMany({
    where,
    orderBy: [{ projectId: "asc" }, { label: "asc" }],
    include: { project: { select: { label: true } } },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    savingType: (r.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET") as "TARGET" | "EMERGENCY",
    targetAmount: Number(r.targetAmount),
    currentAmount: Number(r.currentAmount),
    deadline: r.deadline?.toISOString().slice(0, 10) ?? null,
    priority: r.priority as "HIGH" | "MEDIUM" | "LOW",
    projectId: r.projectId ?? undefined,
    projectLabel: r.project?.label ?? undefined,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
