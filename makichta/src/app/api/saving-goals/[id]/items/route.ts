import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavingGoalItems } from "@/models/saving-goals/services/get-saving-goal-items";
import { createSavingGoalItem } from "@/models/saving-goals/services/create-saving-goal-item";

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
    return NextResponse.json({ error: "ID objectif requis" }, { status: 400 });
  }

  try {
    const items = await getSavingGoalItems(session.user.id, id);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des items" },
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
    return NextResponse.json({ error: "ID objectif requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, url, amount, description, order } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 }
      );
    }
    if (amount == null || isNaN(Number(amount)) || Number(amount) < 0) {
      return NextResponse.json(
        { error: "Le montant doit être un nombre positif ou zéro" },
        { status: 400 }
      );
    }

    const item = await createSavingGoalItem(session.user.id, {
      savingGoalId: id,
      title: String(title).trim(),
      url: url != null ? String(url) : undefined,
      amount: Number(amount),
      description: description != null ? String(description) : undefined,
      order: order != null ? Number(order) : undefined,
    });

    if (!item) {
      return NextResponse.json(
        { error: "Objectif non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'item" },
      { status: 500 }
    );
  }
}
