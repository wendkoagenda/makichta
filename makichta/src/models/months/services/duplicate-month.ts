import { prisma } from "@/lib/db";
import { createAllocationsForRevenue } from "@/models/allocation-rules/services/create-allocations-for-revenue";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface DuplicateMonthOptions {
  includeRevenues?: boolean;
}

export interface DuplicateMonthResult {
  rulesCreated: number;
  categoriesCreated: number;
  revenuesCreated: number;
}

/**
 * Duplique la configuration d'un mois (règles de répartition, catégories de dépenses)
 * vers un mois cible. Optionnellement duplique les revenus.
 */
export async function duplicateMonth(
  userId: string,
  sourceMonth: string,
  targetMonth: string,
  options: DuplicateMonthOptions = {}
): Promise<DuplicateMonthResult> {
  if (!MONTH_REGEX.test(sourceMonth) || !MONTH_REGEX.test(targetMonth)) {
    throw new Error("Format de mois invalide (attendu: YYYY-MM)");
  }
  if (sourceMonth === targetMonth) {
    throw new Error("Le mois source et le mois cible doivent être différents");
  }

  const includeRevenues = options.includeRevenues === true;
  const result: DuplicateMonthResult = {
    rulesCreated: 0,
    categoriesCreated: 0,
    revenuesCreated: 0,
  };

  await prisma.$transaction(async (tx) => {
    const sourceCategories = await (tx as typeof prisma).expenseCategory.findMany({
      where: { userId, monthId: sourceMonth },
      orderBy: { label: "asc" },
    });

    const categoryIdMap = new Map<string, string>();
    for (const cat of sourceCategories) {
      const created = await (tx as typeof prisma).expenseCategory.create({
        data: {
          userId,
          label: cat.label,
          type: cat.type,
          monthlyBudget: cat.monthlyBudget,
          budgetPercent: cat.budgetPercent,
          monthId: targetMonth,
        },
      });
      categoryIdMap.set(cat.id, created.id);
      result.categoriesCreated += 1;
    }

    const sourceRules = await (tx as typeof prisma).allocationRule.findMany({
      where: { userId, monthId: sourceMonth },
      include: { categories: { select: { id: true } } },
    } as any);

    for (const rule of sourceRules) {
      const ruleWithCategories = rule as unknown as { categories: { id: string }[] };
      const newCategoryIds = ruleWithCategories.categories
        .map((c) => categoryIdMap.get(c.id))
        .filter((id): id is string => id != null);
      await (tx as typeof prisma).allocationRule.create({
        data: {
          userId,
          label: rule.label,
          percentage: rule.percentage,
          monthId: targetMonth,
          ...(newCategoryIds.length > 0 && {
            categories: { connect: newCategoryIds.map((id) => ({ id })) },
          }),
        },
      } as any);
      result.rulesCreated += 1;
    }
  });

  if (includeRevenues) {
    const [ty, tm] = targetMonth.split("-").map(Number);

    const revenues = await prisma.revenue.findMany({
      where: { userId, monthId: sourceMonth },
    });

    for (const rev of revenues) {
      const sourceDay = rev.date.getDate();
      const targetDate = new Date(ty, tm - 1, Math.min(sourceDay, new Date(ty, tm, 0).getDate()));
      const created = await prisma.revenue.create({
        data: {
          userId,
          sourceId: rev.sourceId,
          monthId: targetMonth,
          amount: rev.amount,
          date: targetDate,
          description: rev.description,
        },
      });
      await createAllocationsForRevenue(
        userId,
        created.id,
        created.amount,
        created.date
      );
      result.revenuesCreated += 1;
    }
  }

  return result;
}
