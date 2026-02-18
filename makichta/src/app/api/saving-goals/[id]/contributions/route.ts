import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavingContributions } from "@/models/saving-goals/services/get-saving-contributions";
import { createSavingContribution } from "@/models/saving-goals/services/create-saving-contribution";
import { prisma } from "@/lib/db";

export async function GET(
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

  const goal = await prisma.savingGoal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!goal) {
    return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 });
  }

  try {
    const contributions = await getSavingContributions(id);
    return NextResponse.json(contributions);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des contributions" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const body = await request.json();
    const { amount, date, isAutomatic } = body;

    if (amount == null || !date) {
      return NextResponse.json(
        { error: "Montant et date requis" },
        { status: 400 }
      );
    }

    const contribution = await createSavingContribution(session.user.id, {
      savingGoalId: id,
      amount: Number(amount),
      date: String(date),
      isAutomatic: Boolean(isAutomatic),
    });

    if (!contribution) {
      return NextResponse.json(
        { error: "Objectif non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(contribution);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
