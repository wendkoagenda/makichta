import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInvestmentSummary } from "@/models/investments/services/get-investment-summary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const summary = await getInvestmentSummary(session.user.id);
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement du résumé" },
      { status: 500 }
    );
  }
}
