import { prisma } from "@/lib/db";
import type { SavingGoal } from "../types/saving-goal";

export interface GetSavingGoalsOptions {
  userId: string;
  projectId?: string | null;
  /** Par défaut non fourni = tous. "ACTIVE" = objectifs en cours, "COMPLETED" = archivés */
  status?: "ACTIVE" | "COMPLETED";
}

export async function getSavingGoals(
  options: GetSavingGoalsOptions | string
): Promise<SavingGoal[]> {
  const userId = typeof options === "string" ? options : options.userId;
  const projectId =
    typeof options === "string" ? undefined : options.projectId;
  const status = typeof options === "string" ? undefined : options.status;

  const where: { userId: string; projectId?: string | null; status?: string } = { userId };
  if (projectId !== undefined) {
    where.projectId = projectId;
  }
  if (status !== undefined) {
    where.status = status;
  }

  const rows = await prisma.savingGoal.findMany({
    where,
    orderBy: [{ projectId: "asc" }, { label: "asc" }],
    include: { project: { select: { label: true } } },
  });

  let itemAggregates: { savingGoalId: string; _sum: { amount: number | null }; _count: number }[] = [];
  try {
    itemAggregates = await prisma.savingGoalItem.groupBy({
      by: ["savingGoalId"],
      _sum: { amount: true },
      _count: true,
    });
  } catch {
    // Table ou client Prisma pas à jour : cible effective = targetAmount
  }

  const effectiveTargetByGoalId = new Map(
    itemAggregates
      .filter((a) => a._count > 0)
      .map((a) => [a.savingGoalId, Number(a._sum?.amount ?? 0)])
  );

  return rows.map((r) => {
    const effectiveTargetAmount =
      effectiveTargetByGoalId.get(r.id) ?? Number(r.targetAmount);
    return {
      id: r.id,
      label: r.label,
      savingType: (r.savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET") as "TARGET" | "EMERGENCY",
      targetAmount: Number(r.targetAmount),
      currentAmount: Number(r.currentAmount),
      status: (r.status === "COMPLETED" ? "COMPLETED" : "ACTIVE") as "ACTIVE" | "COMPLETED",
      deadline: r.deadline?.toISOString().slice(0, 10) ?? null,
      priority: r.priority as "HIGH" | "MEDIUM" | "LOW",
      projectId: r.projectId ?? undefined,
      projectLabel: r.project?.label ?? undefined,
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString(),
      effectiveTargetAmount,
    };
  });
}
