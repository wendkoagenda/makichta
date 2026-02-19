import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavingGoals } from "@/models/saving-goals/services/get-saving-goals";
import { createSavingGoal } from "@/models/saving-goals/services/create-saving-goal";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") ?? undefined;
    const goals = await getSavingGoals({
      userId: session.user.id,
      ...(projectId !== undefined && { projectId: projectId || null }),
    });
    return NextResponse.json(goals);
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
    const { label, targetAmount, deadline, priority, projectId } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Libellé requis" },
        { status: 400 }
      );
    }

    const goal = await createSavingGoal(session.user.id, {
      label: String(label).trim(),
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
