import { prisma } from "@/lib/db";

export interface TypeSummary {
  type: string;
  total: number;
  count: number;
  percent: number;
}

export interface InvestmentSummary {
  total: number;
  allocatedFromRevenues: number;
  byType: TypeSummary[];
}

/**
 * Somme des montants alloués à l'investissement via la répartition des revenus.
 * Correspond aux règles dont le libellé contient "investissement" (insensible à la casse).
 */
async function getAllocatedToInvestment(
  userId: string
): Promise<number> {
  const rules = await prisma.allocationRule.findMany({
    where: { userId },
  });
  const investmentRuleIds = rules
    .filter((r) => r.label.toLowerCase().includes("investissement"))
    .map((r) => r.id);
  if (investmentRuleIds.length === 0) return 0;

  const allocations = await prisma.allocation.findMany({
    where: { ruleId: { in: investmentRuleIds } },
  });
  return allocations.reduce((s, a) => s + a.amount, 0);
}

export async function getInvestmentSummary(
  userId: string
): Promise<InvestmentSummary> {
  const [rows, allocatedFromRevenues] = await Promise.all([
    prisma.investment.findMany({ where: { userId } }),
    getAllocatedToInvestment(userId),
  ]);

  const total = rows.reduce((s, r) => s + r.amount, 0);
  const byTypeMap = rows.reduce(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = { total: 0, count: 0 };
      acc[r.type].total += r.amount;
      acc[r.type].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );

  const byType: TypeSummary[] = Object.entries(byTypeMap).map(
    ([type, { total: t, count }]) => ({
      type,
      total: t,
      count,
      percent: total > 0 ? Math.round((t / total) * 1000) / 10 : 0,
    })
  );

  byType.sort((a, b) => b.total - a.total);

  return { total, allocatedFromRevenues, byType };
}
