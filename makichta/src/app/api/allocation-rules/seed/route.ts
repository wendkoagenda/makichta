import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { seedDefaultAllocationRules } from "@/models/allocation-rules/services/seed-default-rules";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const rules = await seedDefaultAllocationRules(session.user.id);
    return NextResponse.json(rules);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'import des règles par défaut" },
      { status: 500 }
    );
  }
}
