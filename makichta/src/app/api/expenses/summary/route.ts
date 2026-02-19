import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getExpenseSummary } from "@/models/expenses/services/get-expense-summary";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const monthId =
    searchParams.get("monthId") ?? searchParams.get("month") ?? undefined;

  if (!monthId || !/^\d{4}-\d{2}$/.test(monthId)) {
    return NextResponse.json(
      { error: "Paramètre month requis (format YYYY-MM)" },
      { status: 400 }
    );
  }

  try {
    const summary = await getExpenseSummary(session.user.id, monthId);
    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement du résumé" },
      { status: 500 }
    );
  }
}
