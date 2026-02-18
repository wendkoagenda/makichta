import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWishlistItems } from "@/models/wishlist/services/get-wishlist-items";
import { createWishlistItem } from "@/models/wishlist/services/create-wishlist-item";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  try {
    const items = await getWishlistItems(session.user.id);
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
    const { label, estimatedCost, priority, url } = body;
    if (!label || estimatedCost == null) {
      return NextResponse.json(
        { error: "Libellé et coût estimé requis" },
        { status: 400 }
      );
    }
    const item = await createWishlistItem(session.user.id, {
      label: String(label).trim(),
      estimatedCost: Number(estimatedCost),
      priority: ["HIGH", "MEDIUM", "LOW"].includes(priority) ? priority : "MEDIUM",
      url: url ? String(url).trim() : null,
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
