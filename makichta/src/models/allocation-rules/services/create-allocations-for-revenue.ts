import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";
import { createSavingContribution } from "@/models/saving-goals/services/create-saving-contribution";

/** Forme des règles utilisée pour le calcul (champs lus depuis Prisma) */
interface RuleRowForAllocation {
  id: string;
  allocationType: string;
  percentage: number;
  amount: number | null;
  savingGoalId: string | null;
}

/**
 * Crée les allocations pour un revenu donné en appliquant les règles du mois du revenu.
 * Si une règle est liée à un objectif d'épargne (savingGoalId), crée une SavingContribution
 * automatique et met à jour le currentAmount de l'objectif.
 * Appelé automatiquement après la création d'un revenu.
 */
export async function createAllocationsForRevenue(
  userId: string,
  revenueId: string,
  amount: number,
  revenueDate: Date,
): Promise<void> {
  const monthId = getMonthIdFromDate(revenueDate);
  const [rulesRaw, revenues] = await Promise.all([
    prisma.allocationRule.findMany({
      where: { userId, monthId },
      select: {
        id: true,
        allocationType: true,
        percentage: true,
        amount: true,
        savingGoalId: true,
      } as { id: true; allocationType: true; percentage: true; amount: true; savingGoalId: true },
    }),
    prisma.revenue.findMany({
      where: { userId, monthId },
      select: { amount: true },
    }),
  ]);

  const rules = rulesRaw as RuleRowForAllocation[];
  if (rules.length === 0) return;

  const totalRevenues = revenues.reduce((s, r) => s + r.amount, 0);

  const allocationAmount = (rule: RuleRowForAllocation): number => {
    if (
      rule.allocationType === "AMOUNT" &&
      rule.amount != null &&
      rule.amount > 0
    ) {
      if (totalRevenues <= 0) return 0;
      return Math.round(rule.amount * (amount / totalRevenues) * 100) / 100;
    }
    return Math.round(amount * (rule.percentage / 100) * 100) / 100;
  };

  await prisma.allocation.createMany({
    data: rules.map((rule) => ({
      revenueId,
      ruleId: rule.id,
      monthId,
      amount: allocationAmount(rule),
    })),
  });

  const dateStr = revenueDate.toISOString().slice(0, 10);
  for (const rule of rules) {
    const amt = allocationAmount(rule);
    if (rule.savingGoalId && amt > 0) {
      await createSavingContribution(userId, {
        savingGoalId: rule.savingGoalId,
        amount: amt,
        date: dateStr,
        isAutomatic: true,
        revenueId: revenueId,
      });
    }
  }
}

/**
 * Recalcule les allocations pour un revenu (supprime les anciennes et en crée de nouvelles).
 * Annule les SavingContributions automatiques liées à ce revenu avant de recréer.
 * Appelé lors de la mise à jour du montant d'un revenu.
 */
export async function recalculateAllocationsForRevenue(
  userId: string,
  revenueId: string,
  amount: number,
  revenueDate: Date,
): Promise<void> {
  const contributions = await prisma.savingContribution.findMany({
    where: { revenueId },
    select: { id: true, savingGoalId: true, amount: true },
  });

  for (const c of contributions) {
    await prisma.$transaction([
      prisma.savingGoal.updateMany({
        where: { id: c.savingGoalId, userId },
        data: { currentAmount: { decrement: c.amount } },
      }),
      prisma.savingContribution.delete({ where: { id: c.id } }),
    ]);
  }

  await prisma.allocation.deleteMany({
    where: { revenueId },
  });
  await createAllocationsForRevenue(userId, revenueId, amount, revenueDate);
}
