import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSavingGoals } from "@/models/saving-goals/services/get-saving-goals";
import { createSavingGoal } from "@/models/saving-goals/services/create-saving-goal";

function getCurrentMonthId(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") ?? undefined;
    const statusParam = searchParams.get("status");
    const status =
      statusParam === "COMPLETED" ? "COMPLETED" : statusParam === "ACTIVE" ? "ACTIVE" : undefined;
    const goals = await getSavingGoals({
      userId: session.user.id,
      ...(projectId !== undefined && { projectId: projectId || null }),
      ...(status !== undefined && { status }),
    });

    const monthId = getCurrentMonthId();
    const [revenues, contributions] = await Promise.all([
      prisma.revenue.findMany({
        where: { userId: session.user.id, monthId },
        select: { id: true },
      }),
      prisma.savingContribution.findMany({
        where: {
          savingGoal: { userId: session.user.id },
          monthId,
        },
        select: { savingGoalId: true, amount: true },
      }),
    ]);
    const revenueIds = revenues.map((r) => r.id);
    const allocatedPerGoal: Record<string, number> = {};
    if (revenueIds.length > 0) {
      const allocations = await prisma.allocation.findMany({
        where: { revenueId: { in: revenueIds } },
        include: { rule: { select: { savingGoalId: true } } },
      });
      for (const a of allocations) {
        const gid = a.rule?.savingGoalId;
        if (gid) allocatedPerGoal[gid] = (allocatedPerGoal[gid] ?? 0) + Number(a.amount);
      }
    }
    const contributionsPerGoal: Record<string, number> = {};
    for (const c of contributions) {
      const gid = c.savingGoalId;
      if (gid) contributionsPerGoal[gid] = (contributionsPerGoal[gid] ?? 0) + Number(c.amount);
    }

    const enriched = goals.map((g) => ({
      ...g,
      allocatedThisMonth: allocatedPerGoal[g.id],
      contributionsThisMonth: contributionsPerGoal[g.id],
    }));

    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des objectifs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { label, savingType, targetAmount, deadline, priority, projectId } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Libellé requis" },
        { status: 400 }
      );
    }

    const goal = await createSavingGoal(session.user.id, {
      label: String(label).trim(),
      savingType: savingType === "EMERGENCY" ? "EMERGENCY" : "TARGET",
      targetAmount: targetAmount != null ? Math.max(0, Number(targetAmount)) : 0,
      deadline: deadline || null,
      priority: priority === "HIGH" || priority === "LOW" ? priority : "MEDIUM",
      ...(projectId !== undefined && projectId !== "" && { projectId }),
    });

    return NextResponse.json(goal);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
