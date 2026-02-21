import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateAllocationRule } from "@/models/allocation-rules/services/update-allocation-rule";
import { deleteAllocationRule } from "@/models/allocation-rules/services/delete-allocation-rule";

export async function PUT(
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
    const body = await _request.json();
    const { label, allocationType, percentage, amount, expenseCategoryIds, savingGoalId } = body;

    const updates: {
      label?: string;
      allocationType?: "PERCENT" | "AMOUNT";
      percentage?: number;
      amount?: number | null;
      expenseCategoryIds?: string[];
      savingGoalId?: string | null;
    } = {};
    if (label != null) updates.label = String(label).trim();
    if (allocationType === "AMOUNT" || allocationType === "PERCENT") {
      updates.allocationType = allocationType;
    }
    if (percentage != null && !isNaN(Number(percentage))) {
      updates.percentage = Math.min(100, Math.max(0, Number(percentage)));
    }
    if (amount !== undefined) {
      updates.amount =
        amount != null && !isNaN(Number(amount)) ? Math.max(0, Number(amount)) : null;
    }
    if (expenseCategoryIds !== undefined) {
      updates.expenseCategoryIds = Array.isArray(expenseCategoryIds)
        ? expenseCategoryIds.filter((id: unknown) => typeof id === "string")
        : [];
    }
    if (savingGoalId !== undefined) {
      updates.savingGoalId =
        savingGoalId != null && savingGoalId !== ""
          ? String(savingGoalId).trim()
          : null;
    }

    const rule = await updateAllocationRule(session.user.id, id, updates);

    if (!rule) {
      return NextResponse.json(
        { error: "Règle non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule);
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
    const deleted = await deleteAllocationRule(session.user.id, id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Règle non trouvée" },
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
