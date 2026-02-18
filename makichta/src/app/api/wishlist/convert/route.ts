import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { linkWishlistItemToSavingGoal } from "@/models/wishlist/services/link-to-saving-goal";

/**
 * Convertit un item wishlist en objectif d'épargne.
 * Crée un nouveau SavingGoal avec label et targetAmount = estimatedCost,
 * puis lie l'item à ce goal.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { itemId } = body;
    if (!itemId) {
      return NextResponse.json(
        { error: "itemId requis" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId: session.user.id },
    });
    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    const goal = await prisma.savingGoal.create({
      data: {
        userId: session.user.id,
        label: item.label,
        targetAmount: item.estimatedCost,
        priority: "MEDIUM",
      },
    });

    const updated = await linkWishlistItemToSavingGoal(
      session.user.id,
      itemId,
      goal.id
    );

    return NextResponse.json({ wishlistItem: updated, savingGoal: goal });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la conversion" },
      { status: 500 }
    );
  }
}
