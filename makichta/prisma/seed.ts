import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  REPARTITION_RULES,
  SAVING_GOAL_LABELS,
  SAVING_GOAL_EMERGENCY_LABEL,
  DEMENAGEMENT_GOAL_ITEMS,
} from "../src/lib/constants/repartition";
import { DEFAULT_EXPENSE_CATEGORIES } from "../src/lib/constants";

const prisma = new PrismaClient();

const SEED_USER = {
  name: "OUEDRAOGO Elisée",
  email: "koagenda.ese@gmail.com",
  password: "password",
};

function getCurrentMonthId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

async function main() {
  const monthId = getCurrentMonthId();

  const existingUser = await prisma.user.findUnique({
    where: { email: SEED_USER.email },
  });
  if (existingUser) {
    console.log("Utilisateur déjà présent:", SEED_USER.email);
    return;
  }

  const passwordHash = await bcrypt.hash(SEED_USER.password, 12);
  const user = await prisma.user.create({
    data: {
      name: SEED_USER.name,
      email: SEED_USER.email,
      passwordHash,
    },
  });
  console.log("Utilisateur créé:", user.email);

  const projects = await Promise.all(
    SAVING_GOAL_LABELS.map((label) =>
      prisma.savingProject.create({
        data: { userId: user.id, label },
      })
    )
  );
  const projectByLabel = new Map(projects.map((p) => [p.label, p.id]));
  console.log("5 projets d'épargne créés.");

  const goals = await Promise.all(
    SAVING_GOAL_LABELS.map((label) => {
      const projectId = projectByLabel.get(label);
      const savingType =
        label === SAVING_GOAL_EMERGENCY_LABEL ? "EMERGENCY" : "TARGET";
      return prisma.savingGoal.create({
        data: {
          userId: user.id,
          label,
          savingType,
          targetAmount: 0,
          ...(projectId && { projectId }),
        },
      });
    })
  );
  const goalByLabel = new Map(goals.map((g) => [g.label, g.id]));
  console.log("5 objectifs d'épargne créés.");

  const demenagementGoalId = goalByLabel.get("Déménagement");
  if (demenagementGoalId) {
    await Promise.all(
      DEMENAGEMENT_GOAL_ITEMS.map((item, index) =>
        prisma.savingGoalItem.create({
          data: {
            savingGoalId: demenagementGoalId,
            title: item.title,
            amount: item.amount,
            order: index,
          },
        })
      )
    );
    console.log(
      `${DEMENAGEMENT_GOAL_ITEMS.length} items de l'objectif Déménagement créés.`
    );
  }

  const categories = await Promise.all(
    DEFAULT_EXPENSE_CATEGORIES.map((c) =>
      prisma.expenseCategory.create({
        data: {
          userId: user.id,
          label: c.label,
          type: c.type,
          monthlyBudget: 0,
          monthId,
        },
      })
    )
  );
  const categoryByLabel = new Map(categories.map((c) => [c.label, c.id]));
  console.log("3 catégories de dépenses créées.");

  for (const rule of REPARTITION_RULES) {
    if (rule.type === "category") {
      const categoryId = categoryByLabel.get(rule.label);
      await prisma.allocationRule.create({
        data: {
          userId: user.id,
          label: rule.label,
          allocationType: "PERCENT",
          percentage: rule.percentage,
          monthId,
          ...(categoryId && {
            categories: { connect: [{ id: categoryId }] },
          }),
        },
      });
    } else {
      const savingGoalId = goalByLabel.get(rule.label);
      await prisma.allocationRule.create({
        data: {
          userId: user.id,
          label: rule.label,
          allocationType: "PERCENT",
          percentage: rule.percentage,
          monthId,
          ...(savingGoalId && { savingGoalId }),
        },
      });
    }
  }
  console.log("8 règles d'allocation créées.");
  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
