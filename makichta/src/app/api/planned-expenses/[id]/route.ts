import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updatePlannedExpense } from "@/models/planned-expenses/services/update-planned-expense";
import { deletePlannedExpense } from "@/models/planned-expenses/services/delete-planned-expense";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  try {
    const body = await request.json();
    const updates: { isDone?: boolean; label?: string; estimatedAmount?: number; dueDate?: string } = {};
    if (body.isDone !== undefined) updates.isDone = Boolean(body.isDone);
    if (body.label != null) updates.label = String(body.label).trim();
    if (body.estimatedAmount != null) updates.estimatedAmount = Number(body.estimatedAmount);
    if (body.dueDate != null) updates.dueDate = String(body.dueDate);

    const item = await updatePlannedExpense(session.user.id, id, updates);
    if (!item) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
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
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  try {
    const deleted = await deletePlannedExpense(session.user.id, id);
    if (!deleted) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
