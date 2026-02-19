import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateSavingGoal } from "@/models/saving-goals/services/update-saving-goal";
import { deleteSavingGoal } from "@/models/saving-goals/services/delete-saving-goal";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { label, targetAmount, deadline, priority, projectId } = body;

    const updates: {
      label?: string;
      targetAmount?: number;
      deadline?: string | null;
      priority?: "HIGH" | "MEDIUM" | "LOW";
      projectId?: string | null;
    } = {};
    if (label != null) updates.label = String(label).trim();
    if (targetAmount != null) updates.targetAmount = Math.max(0, Number(targetAmount));
    if (deadline !== undefined) updates.deadline = deadline || null;
    if (priority != null && ["HIGH", "MEDIUM", "LOW"].includes(priority)) {
      updates.priority = priority;
    }
    if (projectId !== undefined) {
      updates.projectId = projectId == null || projectId === "" ? null : projectId;
    }

    const goal = await updateSavingGoal(session.user.id, id, updates);

    if (!goal) {
      return NextResponse.json(
        { error: "Objectif non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(goal);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const deleted = await deleteSavingGoal(session.user.id, id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Objectif non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
