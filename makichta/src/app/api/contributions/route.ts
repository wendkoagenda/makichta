import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllContributionsForUser } from "@/models/saving-goals/services/get-all-contributions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const contributions = await getAllContributionsForUser(session.user.id);
    return NextResponse.json(contributions);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des contributions" },
      { status: 500 }
    );
  }
}
