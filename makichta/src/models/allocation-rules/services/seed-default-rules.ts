import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import {
  REPARTITION_RULES,
  SAVING_GOAL_LABELS,
  SAVING_GOAL_EMERGENCY_LABEL,
} from "@/lib/constants/repartition";
import type { AllocationRule } from "../types/allocation-rule";
import { getAllocationRules } from "./get-allocation-rules";

export async function seedDefaultAllocationRules(
  userId: string,
  monthId?: string
): Promise<AllocationRule[]> {
  const targetMonthId =
    typeof monthId === "string" && monthId ? monthId : getCurrentMonthId();
  const existing = await prisma.allocationRule.findFirst({
    where: { userId, monthId: targetMonthId },
  });
  if (existing) return getAllocationRules(userId, targetMonthId);

  const categories = await prisma.expenseCategory.findMany({
    where: { userId, monthId: targetMonthId },
    select: { id: true, label: true },
  });
  const categoryByLabel = new Map(categories.map((c) => [c.label, c.id]));

  const projects = await Promise.all(
    SAVING_GOAL_LABELS.map((label) =>
      prisma.savingProject.create({
        data: { userId, label },
      })
    )
  );
  const projectByLabel = new Map(projects.map((p) => [p.label, p.id]));

  const goals = await Promise.all(
    SAVING_GOAL_LABELS.map((label) => {
      const projectId = projectByLabel.get(label);
      const savingType =
        label === SAVING_GOAL_EMERGENCY_LABEL ? "EMERGENCY" : "TARGET";
      return prisma.savingGoal.create({
        data: {
          userId,
          label,
          savingType,
          targetAmount: 0,
          ...(projectId && { projectId }),
        } as Prisma.SavingGoalUncheckedCreateInput,
      });
    })
  );
  const goalByLabel = new Map(goals.map((g) => [g.label, g.id]));

  for (const rule of REPARTITION_RULES) {
    if (rule.type === "category") {
      const categoryId = categoryByLabel.get(rule.label);
      await prisma.allocationRule.create({
        data: {
          userId,
          label: rule.label,
          allocationType: "PERCENT",
          percentage: rule.percentage,
          monthId: targetMonthId,
          ...(categoryId && {
            categories: { connect: [{ id: categoryId }] },
          }),
        } as Parameters<typeof prisma.allocationRule.create>[0]["data"],
      });
    } else {
      const savingGoalId = goalByLabel.get(rule.label);
      await prisma.allocationRule.create({
        data: {
          userId,
          label: rule.label,
          allocationType: "PERCENT",
          percentage: rule.percentage,
          monthId: targetMonthId,
          ...(savingGoalId && { savingGoalId }),
        } as Parameters<typeof prisma.allocationRule.create>[0]["data"],
      });
    }
  }

  return getAllocationRules(userId, targetMonthId);
}
