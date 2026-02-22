import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteSavingContribution } from "@/models/saving-goals/services/delete-saving-contribution";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ contributionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { contributionId } = await params;
  if (!contributionId) {
    return NextResponse.json({ error: "ID de contribution requis" }, { status: 400 });
  }

  const deleted = await deleteSavingContribution(session.user.id, contributionId);
  if (!deleted) {
    return NextResponse.json(
      { error: "Contribution non trouvée ou non autorisée" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
