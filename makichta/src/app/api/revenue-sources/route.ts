import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRevenueSources } from "@/models/revenues/services/get-revenue-sources";
import { createRevenueSource } from "@/models/revenues/services/create-revenue-source";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const sources = await getRevenueSources(session.user.id);
    return NextResponse.json(sources);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des sources" },
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
    const { label, frequency, recurrenceInterval } = body;

    if (!label || !frequency) {
      return NextResponse.json(
        { error: "Libellé et fréquence requis" },
        { status: 400 }
      );
    }

    const source = await createRevenueSource(session.user.id, {
      label: String(label).trim(),
      frequency: frequency === "ONE_TIME" ? "ONE_TIME" : "RECURRING",
      recurrenceInterval:
        frequency === "RECURRING" && recurrenceInterval
          ? recurrenceInterval
          : null,
    });

    return NextResponse.json(source);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
