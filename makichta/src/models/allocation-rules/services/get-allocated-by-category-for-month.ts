import { prisma } from "@/lib/db";

/**
 * Pour un utilisateur et un monthId (YYYY-MM), retourne le montant alloué par catégorie
 * de dépenses (somme des Allocation.amount dont le revenu est dans ce mois).
 * Une même allocation peut contribuer à plusieurs catégories si la règle est liée à plusieurs.
 */
export async function getAllocatedByCategoryForMonth(
  userId: string,
  monthId: string
): Promise<Record<string, number>> {
  const revenueIds = (
    await prisma.revenue.findMany({
      where: { userId, monthId },
      select: { id: true },
    })
  ).map((r) => r.id);

  if (revenueIds.length === 0) return {};

  interface AllocationWithRuleCategories {
    amount: number;
    rule: { categories: { id: string }[] };
  }

  const allocations = (await prisma.allocation.findMany({
    where: { revenueId: { in: revenueIds } },
    include: {
      rule: {
        include: {
          categories: { select: { id: true } },
        },
      },
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- include rule.categories jusqu'à régénération du client Prisma
  } as any)) as unknown as AllocationWithRuleCategories[];

  const byCategoryId: Record<string, number> = {};
  for (const a of allocations) {
    for (const cat of a.rule.categories) {
      byCategoryId[cat.id] = (byCategoryId[cat.id] ?? 0) + a.amount;
    }
  }
  return byCategoryId;
}
