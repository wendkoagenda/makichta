import { prisma } from "@/lib/db";

/**
 * Supprime un revenu et annule rétroactivement les contributions automatiques
 * liées à ce revenu (décrémente les currentAmount des objectifs et supprime les contributions).
 * Les allocations sont supprimées en cascade par la base.
 */
export async function deleteRevenue(userId: string, id: string): Promise<boolean> {
  const revenue = await prisma.revenue.findFirst({
    where: { id, userId },
  });
  if (!revenue) return false;

  const contributions = await prisma.savingContribution.findMany({
    where: { revenueId: id },
    select: { id: true, savingGoalId: true, amount: true },
  });

  await prisma.$transaction(async (tx) => {
    for (const c of contributions) {
      await tx.savingGoal.updateMany({
        where: { id: c.savingGoalId, userId },
        data: { currentAmount: { decrement: c.amount } },
      });
      await tx.savingContribution.delete({ where: { id: c.id } });
    }
    await tx.revenue.delete({ where: { id, userId } });
  });

  return true;
}
