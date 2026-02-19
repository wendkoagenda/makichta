import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllMonths } from "@/models/months/services/get-months";

/**
 * GET /api/months — Liste des mois (table Month) pour alimenter les pickers.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const months = await getAllMonths();
    return NextResponse.json(months);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des mois" },
      { status: 500 }
    );
  }
}
