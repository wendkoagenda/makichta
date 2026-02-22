import { prisma } from "@/lib/db";

/**
 * Supprime une contribution d'épargne et décrémente le currentAmount de l'objectif.
 * Si la contribution était automatique (revenueId renseigné), supprime aussi l'Allocation
 * correspondante pour garder les montants alloués cohérents.
 */
export async function deleteSavingContribution(
  userId: string,
  contributionId: string
): Promise<boolean> {
  const contribution = await prisma.savingContribution.findFirst({
    where: { id: contributionId },
    include: {
      savingGoal: true,
    },
  });
  if (!contribution || contribution.savingGoal.userId !== userId) {
    return false;
  }

  const amount = Number(contribution.amount);
  const savingGoalId = contribution.savingGoalId;
  const revenueId = contribution.revenueId;

  await prisma.$transaction(async (tx) => {
    if (revenueId) {
      const rules = await tx.allocationRule.findMany({
        where: { savingGoalId },
        select: { id: true },
      });
      const ruleIds = rules.map((r) => r.id);
      if (ruleIds.length > 0) {
        await tx.allocation.deleteMany({
          where: { revenueId, ruleId: { in: ruleIds } },
        });
      }
    }
    await tx.savingGoal.update({
      where: { id: savingGoalId },
      data: { currentAmount: { decrement: amount } },
    });
    await tx.savingContribution.delete({
      where: { id: contributionId },
    });
  });

  return true;
}
