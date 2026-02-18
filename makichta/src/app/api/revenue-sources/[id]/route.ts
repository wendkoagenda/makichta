import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateRevenueSource } from "@/models/revenues/services/update-revenue-source";
import { deleteRevenueSource } from "@/models/revenues/services/delete-revenue-source";

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
    const { label, frequency, recurrenceInterval } = body;

    const input: { label?: string; frequency?: "RECURRING" | "ONE_TIME"; recurrenceInterval?: "WEEKLY" | "MONTHLY" | "YEARLY" | null } = {};
    if (label != null) input.label = String(label).trim();
    if (frequency != null) {
      input.frequency = frequency === "ONE_TIME" ? "ONE_TIME" : "RECURRING";
      input.recurrenceInterval =
        frequency === "RECURRING" && recurrenceInterval
          ? recurrenceInterval
          : null;
    }
    const source = await updateRevenueSource(session.user.id, id, input);

    if (!source) {
      return NextResponse.json({ error: "Source non trouvée" }, { status: 404 });
    }

    return NextResponse.json(source);
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
    const deleted = await deleteRevenueSource(session.user.id, id);
    if (!deleted) {
      return NextResponse.json({ error: "Source non trouvée" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
