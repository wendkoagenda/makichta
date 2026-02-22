import { prisma } from "@/lib/db";

export interface ValidateSavingGoalInput {
  /** Si true, crée un Actif (bien) dans Actifs & passifs avec le label et le montant de l'objectif */
  createAsset?: boolean;
  /** Durée d'amortissement en mois (requise si createAsset = true). Défaut 60. */
  depreciationDurationMonths?: number;
  /** Date d'acquisition pour l'actif (défaut = aujourd'hui) */
  acquisitionDate?: string;
}

/**
 * Valide un objectif d'épargne atteint : passe en COMPLETED, remet currentAmount à 0.
 * Optionnellement crée un Actif dans Actifs & passifs.
 */
export async function validateSavingGoal(
  userId: string,
  goalId: string,
  input: ValidateSavingGoalInput = {}
): Promise<boolean> {
  const goal = await prisma.savingGoal.findFirst({
    where: { id: goalId, userId },
  });
  if (!goal) return false;

  const targetAmount = Number(goal.targetAmount);
  const createAssetOption = input.createAsset === true;

  await prisma.$transaction(async (tx) => {
    await tx.savingGoal.update({
      where: { id: goalId },
      data: { status: "COMPLETED", currentAmount: 0 },
    });

    if (createAssetOption && targetAmount > 0) {
      const acquisitionDate = input.acquisitionDate
        ? new Date(input.acquisitionDate)
        : new Date();
      const months = Math.max(1, input.depreciationDurationMonths ?? 60);
      await tx.asset.create({
        data: {
          userId,
          label: goal.label,
          purchaseValue: targetAmount,
          depreciationDurationMonths: months,
          acquisitionDate,
        },
      });
    }
  });

  return true;
}
