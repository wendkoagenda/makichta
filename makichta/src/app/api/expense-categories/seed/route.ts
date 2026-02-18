import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { seedDefaultExpenseCategories } from "@/models/expense-categories/services/seed-default-categories";
import { getExpenseCategories } from "@/models/expense-categories/services/get-expense-categories";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    await seedDefaultExpenseCategories(session.user.id);
    const categories = await getExpenseCategories(session.user.id);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création des catégories par défaut" },
      { status: 500 }
    );
  }
}
