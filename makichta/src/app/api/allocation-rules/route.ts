import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllocationRules } from "@/models/allocation-rules/services/get-allocation-rules";
import { createAllocationRule } from "@/models/allocation-rules/services/create-allocation-rule";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const rules = await getAllocationRules(session.user.id);
    return NextResponse.json(rules);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des règles" },
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
    const { label, percentage } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Libellé requis" },
        { status: 400 }
      );
    }

    const pct =
      percentage != null && !isNaN(Number(percentage))
        ? Math.min(100, Math.max(0, Number(percentage)))
        : 0;

    const rule = await createAllocationRule(session.user.id, {
      label: String(label).trim(),
      percentage: pct,
    });

    return NextResponse.json(rule);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
