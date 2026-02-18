import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getExpenseCategories } from "@/models/expense-categories/services/get-expense-categories";
import { createExpenseCategory } from "@/models/expense-categories/services/create-expense-category";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const categories = await getExpenseCategories(session.user.id);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des catégories" },
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
    const { label, type, monthlyBudget, budgetPercent } = body;

    if (!label || !type) {
      return NextResponse.json(
        { error: "Libellé et type requis" },
        { status: 400 }
      );
    }

    const hasPercent =
      budgetPercent != null && !isNaN(Number(budgetPercent)) && Number(budgetPercent) >= 0;
    const percent = hasPercent ? Math.min(100, Number(budgetPercent)) : undefined;

    const category = await createExpenseCategory(session.user.id, {
      label: String(label).trim(),
      type: type === "VARIABLE" ? "VARIABLE" : "FIXED",
      monthlyBudget:
        percent == null && monthlyBudget != null
          ? Math.max(0, Number(monthlyBudget))
          : percent != null
            ? 0
            : undefined,
      budgetPercent: percent ?? null,
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
