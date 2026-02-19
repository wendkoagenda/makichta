import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import { seedDefaultExpenseCategories } from "@/models/expense-categories/services/seed-default-categories";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const monthId =
      (typeof body?.monthId === "string" && body.monthId) ||
      (typeof body?.month === "string" && body.month)
        ? (body.monthId ?? body.month)
        : getCurrentMonthId();
    const categories = await seedDefaultExpenseCategories(session.user.id, monthId);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création des catégories par défaut" },
      { status: 500 }
    );
  }
}
