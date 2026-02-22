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

  const amount = input.amount;
  const [contribution] = await prisma.$transaction([
    prisma.savingContribution.create({
      data: {
        savingGoalId: input.savingGoalId,
        monthId,
        amount,
        date,
        isAutomatic: input.isAutomatic ?? false,
        revenueId: input.revenueId ?? undefined,
      },
    }),
    prisma.savingGoal.update({
      where: { id: input.savingGoalId },
      data: {
        currentAmount: amount >= 0 ? { increment: amount } : { decrement: Math.abs(amount) },
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
