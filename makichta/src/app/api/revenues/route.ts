import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRevenues } from "@/models/revenues/services/get-revenues";
import { createRevenue } from "@/models/revenues/services/create-revenue";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId") ?? undefined;
  const monthId = searchParams.get("monthId") ?? searchParams.get("month") ?? undefined;

  try {
    const revenues = await getRevenues({
      userId: session.user.id,
      sourceId,
      monthId,
    });
    return NextResponse.json(revenues);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des revenus" },
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
    const { sourceId, amount, date, description } = body;

    if (!sourceId || amount == null || !date) {
      return NextResponse.json(
        { error: "Source, montant et date requis" },
        { status: 400 }
      );
    }

    const revenue = await createRevenue(session.user.id, {
      sourceId,
      amount: Number(amount),
      date: String(date),
      description: description ? String(description).trim() : undefined,
    });

    return NextResponse.json(revenue);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
