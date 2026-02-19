import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentMonthId } from "@/models/months/services/get-months";
import { getAllocationRules } from "@/models/allocation-rules/services/get-allocation-rules";
import { createAllocationRule } from "@/models/allocation-rules/services/create-allocation-rule";

function parseMonthId(value: string | null): string {
  if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
  return getCurrentMonthId();
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const monthId = parseMonthId(
      new URL(request.url).searchParams.get("monthId") ??
        new URL(request.url).searchParams.get("month")
    );
    const rules = await getAllocationRules(session.user.id, monthId);
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
    const { label, percentage, expenseCategoryIds, monthId, month } = body;
    const resolvedMonthId =
      (typeof monthId === "string" && monthId) || (typeof month === "string" && month)
        ? (monthId || month)
        : getCurrentMonthId();

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
      monthId: resolvedMonthId,
      expenseCategoryIds: Array.isArray(expenseCategoryIds)
        ? expenseCategoryIds.filter((id: unknown) => typeof id === "string")
        : undefined,
    });

    return NextResponse.json(rule);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
