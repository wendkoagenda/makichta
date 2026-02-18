import { prisma } from "@/lib/db";
import type {
  CreateSavingContributionInput,
  SavingContribution,
} from "../types/saving-contribution";

export async function createSavingContribution(
  userId: string,
  input: CreateSavingContributionInput
): Promise<SavingContribution | null> {
  const goal = await prisma.savingGoal.findFirst({
    where: { id: input.savingGoalId, userId },
  });
  if (!goal) return null;

  const [contribution] = await prisma.$transaction([
    prisma.savingContribution.create({
      data: {
        savingGoalId: input.savingGoalId,
        amount: Math.max(0, input.amount),
        date: new Date(input.date),
        isAutomatic: input.isAutomatic ?? false,
      },
    }),
    prisma.savingGoal.update({
      where: { id: input.savingGoalId },
      data: {
        currentAmount: {
          increment: Math.max(0, input.amount),
        },
      },
    }),
  ]);

  return {
    id: contribution.id,
    savingGoalId: contribution.savingGoalId,
    amount: contribution.amount,
    date: contribution.date.toISOString().slice(0, 10),
    isAutomatic: contribution.isAutomatic,
    createdAt: contribution.createdAt?.toISOString(),
  };
}
