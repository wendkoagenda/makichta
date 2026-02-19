import { prisma } from "@/lib/db";
import { getMonthIdFromDate } from "@/models/months/services/get-months";
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

  const date = new Date(input.date);
  const monthId = getMonthIdFromDate(date);

  const [contribution] = await prisma.$transaction([
    prisma.savingContribution.create({
      data: {
        savingGoalId: input.savingGoalId,
        monthId,
        amount: Math.max(0, input.amount),
        date,
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
