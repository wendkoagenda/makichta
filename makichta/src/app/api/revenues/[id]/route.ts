import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateRevenue } from "@/models/revenues/services/update-revenue";
import { deleteRevenue } from "@/models/revenues/services/delete-revenue";

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
    const { sourceId, amount, date, description } = body;

    const revenue = await updateRevenue(session.user.id, id, {
      ...(sourceId != null && { sourceId }),
      ...(amount != null && { amount: Number(amount) }),
      ...(date != null && { date: String(date) }),
      ...(description !== undefined && { description: String(description) }),
    });

    if (!revenue) {
      return NextResponse.json({ error: "Revenu non trouvé" }, { status: 404 });
    }

    return NextResponse.json(revenue);
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
    const deleted = await deleteRevenue(session.user.id, id);
    if (!deleted) {
      return NextResponse.json({ error: "Revenu non trouvé" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
