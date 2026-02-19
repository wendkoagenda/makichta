import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";

/**
 * Crée les allocations pour un revenu donné en appliquant les règles du mois du revenu.
 * Appelé automatiquement après la création d'un revenu.
 */
export async function createAllocationsForRevenue(
  userId: string,
  revenueId: string,
  amount: number,
  revenueDate: Date
): Promise<void> {
  const monthId = getMonthIdFromDate(revenueDate);
  const rules = await prisma.allocationRule.findMany({
    where: { userId, monthId },
  });

  if (rules.length === 0) return;

  await prisma.allocation.createMany({
    data: rules.map((rule) => ({
      revenueId,
      ruleId: rule.id,
      monthId,
      amount: Math.round((amount * (rule.percentage / 100)) * 100) / 100,
    })),
  });
}

/**
 * Recalcule les allocations pour un revenu (supprime les anciennes et en crée de nouvelles).
 * Appelé lors de la mise à jour du montant d'un revenu.
 */
export async function recalculateAllocationsForRevenue(
  userId: string,
  revenueId: string,
  amount: number,
  revenueDate: Date
): Promise<void> {
  await prisma.allocation.deleteMany({
    where: { revenueId },
  });
  await createAllocationsForRevenue(userId, revenueId, amount, revenueDate);
}
