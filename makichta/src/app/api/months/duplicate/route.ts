import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { duplicateMonth } from "@/models/months/services/duplicate-month";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { sourceMonth, targetMonth, includeRevenues } = body;

    if (!sourceMonth || !targetMonth) {
      return NextResponse.json(
        { error: "sourceMonth et targetMonth requis (format YYYY-MM)" },
        { status: 400 }
      );
    }

    const result = await duplicateMonth(session.user.id, sourceMonth, targetMonth, {
      includeRevenues: includeRevenues === true,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de la duplication";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
