import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import { getExpenseCategories } from "@/models/expense-categories/services/get-expense-categories";
import { createExpenseCategory } from "@/models/expense-categories/services/create-expense-category";

function parseMonthId(value: string | null): string {
  if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
  return getCurrentMonthId();
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const monthId = parseMonthId(
      new URL(request.url).searchParams.get("monthId") ??
        new URL(request.url).searchParams.get("month")
    );
    const categories = await getExpenseCategories(session.user.id, monthId);
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
    const { label, type, monthlyBudget, budgetPercent, monthId, month } = body;
    const resolvedMonthId =
      (typeof monthId === "string" && monthId) || (typeof month === "string" && month)
        ? (monthId || month)
        : getCurrentMonthId();

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
      monthId: resolvedMonthId,
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
