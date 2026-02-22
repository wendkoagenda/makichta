import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateSavingGoal } from "@/models/saving-goals/services/validate-saving-goal";

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
    const body = await request.json().catch(() => ({}));
    const { createAsset, depreciationDurationMonths, acquisitionDate } = body;

    const ok = await validateSavingGoal(session.user.id, id, {
      createAsset: Boolean(createAsset),
      depreciationDurationMonths:
        depreciationDurationMonths != null
          ? Math.max(1, Number(depreciationDurationMonths))
          : undefined,
      acquisitionDate:
        typeof acquisitionDate === "string" && acquisitionDate
          ? acquisitionDate
          : undefined,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Objectif non trouvé ou non atteint" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la validation" },
      { status: 500 }
    );
  }
}
