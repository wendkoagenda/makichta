import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPlannedExpenses } from "@/models/planned-expenses/services/get-planned-expenses";
import { createPlannedExpense } from "@/models/planned-expenses/services/create-planned-expense";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  try {
    const items = await getPlannedExpenses(session.user.id);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
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
    const { label, estimatedAmount, dueDate, isRecurring, recurrenceInterval } = body;
    if (!label || estimatedAmount == null || !dueDate) {
      return NextResponse.json(
        { error: "Libellé, montant et date requis" },
        { status: 400 }
      );
    }
    const item = await createPlannedExpense(session.user.id, {
      label: String(label).trim(),
      estimatedAmount: Number(estimatedAmount),
      dueDate: String(dueDate),
      isRecurring: Boolean(isRecurring),
      recurrenceInterval: recurrenceInterval || null,
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
