import { prisma } from "@/lib/db";
import type { ContributionEnriched } from "../types/contribution-enriched";

export async function getAllContributionsForUser(
  userId: string
): Promise<ContributionEnriched[]> {
  const rows = await prisma.savingContribution.findMany({
    where: { savingGoal: { userId } },
    orderBy: { date: "desc" },
    include: {
      savingGoal: {
        select: {
          id: true,
          label: true,
          project: { select: { label: true } },
        },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    savingGoalId: r.savingGoalId,
    goalLabel: r.savingGoal.label,
    projectLabel: r.savingGoal.project?.label ?? null,
    amount: Number(r.amount),
    date: r.date.toISOString().slice(0, 10),
    isAutomatic: r.isAutomatic,
    monthId: r.monthId,
    createdAt: r.createdAt?.toISOString(),
  }));
}
