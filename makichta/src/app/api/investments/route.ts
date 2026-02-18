import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInvestments } from "@/models/investments/services/get-investments";
import { createInvestment } from "@/models/investments/services/create-investment";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;

  try {
    const investments = await getInvestments({
      userId: session.user.id,
      type,
    });
    return NextResponse.json(investments);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des investissements" },
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
    const { type, amount, date, description } = body;

    if (!type || amount == null || !date) {
      return NextResponse.json(
        { error: "Type, montant et date requis" },
        { status: 400 }
      );
    }

    const investment = await createInvestment(session.user.id, {
      type: String(type),
      amount: Number(amount),
      date: String(date),
      description: description ? String(description).trim() : undefined,
    });

    return NextResponse.json(investment);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
