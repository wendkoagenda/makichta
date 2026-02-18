import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateExpenseCategory } from "@/models/expense-categories/services/update-expense-category";
import { deleteExpenseCategory } from "@/models/expense-categories/services/delete-expense-category";

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
    const { label, type, monthlyBudget, budgetPercent } = body;

    const hasPercent =
      budgetPercent != null && !isNaN(Number(budgetPercent)) && Number(budgetPercent) >= 0;
    const percent = hasPercent ? Math.min(100, Number(budgetPercent)) : null;

    const updates: {
      label?: string;
      type?: "FIXED" | "VARIABLE";
      monthlyBudget?: number;
      budgetPercent?: number | null;
    } = {};
    if (label != null) updates.label = String(label).trim();
    if (type != null) updates.type = type === "VARIABLE" ? "VARIABLE" : "FIXED";
    if (percent != null) {
      updates.budgetPercent = percent;
      updates.monthlyBudget = 0;
    } else {
      updates.budgetPercent = null;
      if (monthlyBudget != null)
        updates.monthlyBudget = Math.max(0, Number(monthlyBudget));
    }

    const category = await updateExpenseCategory(session.user.id, id, updates);

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
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
    const deleted = await deleteExpenseCategory(session.user.id, id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
