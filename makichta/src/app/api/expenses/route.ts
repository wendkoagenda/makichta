import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getExpenses } from "@/models/expenses/services/get-expenses";
import { createExpense } from "@/models/expenses/services/create-expense";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const month = searchParams.get("month") ?? undefined;

  try {
    const expenses = await getExpenses({
      userId: session.user.id,
      categoryId,
      month,
    });
    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des dépenses" },
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
    const { categoryId, amount, date, description } = body;

    if (!categoryId || amount == null || !date) {
      return NextResponse.json(
        { error: "Catégorie, montant et date requis" },
        { status: 400 }
      );
    }

    const expense = await createExpense(session.user.id, {
      categoryId,
      amount: Number(amount),
      date: String(date),
      description: description ? String(description).trim() : undefined,
    });

    return NextResponse.json(expense);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
