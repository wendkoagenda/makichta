import { prisma } from "@/lib/db";

/**
 * Crée les allocations pour un revenu donné en appliquant toutes les règles de l'utilisateur.
 * Appelé automatiquement après la création d'un revenu.
 */
export async function createAllocationsForRevenue(
  userId: string,
  revenueId: string,
  amount: number
): Promise<void> {
  const rules = await prisma.allocationRule.findMany({
    where: { userId },
  });

  if (rules.length === 0) return;

  await prisma.allocation.createMany({
    data: rules.map((rule) => ({
      revenueId,
      ruleId: rule.id,
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
  amount: number
): Promise<void> {
  await prisma.allocation.deleteMany({
    where: { revenueId },
  });
  await createAllocationsForRevenue(userId, revenueId, amount);
}
