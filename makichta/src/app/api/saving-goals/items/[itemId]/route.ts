import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateSavingGoalItem } from "@/models/saving-goals/services/update-saving-goal-item";
import { deleteSavingGoalItem } from "@/models/saving-goals/services/delete-saving-goal-item";

function itemToJson(r: {
  id: string;
  savingGoalId: string;
  title: string;
  url: string | null;
  amount: unknown;
  description: string | null;
  order: number | null;
  purchasedAt?: Date | null;
  purchasedAmount?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}) {
  return {
    id: r.id,
    savingGoalId: r.savingGoalId,
    title: r.title,
    url: r.url ?? null,
    amount: Number(r.amount),
    description: r.description ?? null,
    order: r.order ?? null,
    purchasedAt: r.purchasedAt?.toISOString() ?? null,
    purchasedAmount: r.purchasedAmount != null ? Number(r.purchasedAmount) : null,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { itemId } = await params;
  if (!itemId) {
    return NextResponse.json({ error: "ID item requis" }, { status: 400 });
  }

  const item = await prisma.savingGoalItem.findFirst({
    where: { id: itemId },
    include: { savingGoal: true },
  });
  if (!item || item.savingGoal.userId !== session.user.id) {
    return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
  }

  return NextResponse.json(itemToJson(item));
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { itemId } = await params;
  if (!itemId) {
    return NextResponse.json({ error: "ID item requis" }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { title, url, amount, description, order, purchasedAt, purchasedAmount } = body;

    const updated = await updateSavingGoalItem(session.user.id, itemId, {
      ...(title !== undefined && { title: String(title) }),
      ...(url !== undefined && { url: url != null ? String(url) : null }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(description !== undefined && {
        description: description != null ? String(description) : null,
      }),
      ...(order !== undefined && { order: order != null ? Number(order) : null }),
      ...(purchasedAt !== undefined && {
        purchasedAt: purchasedAt != null ? String(purchasedAt) : null,
      }),
      ...(purchasedAmount !== undefined && {
        purchasedAmount: purchasedAmount != null ? Number(purchasedAmount) : null,
      }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { itemId } = await params;
  if (!itemId) {
    return NextResponse.json({ error: "ID item requis" }, { status: 400 });
  }

  const deleted = await deleteSavingGoalItem(session.user.id, itemId);
  if (!deleted) {
    return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
