import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateSavingProject } from "@/models/saving-projects/services/update-saving-project";
import { deleteSavingProject } from "@/models/saving-projects/services/delete-saving-project";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const { getSavingProjects } = await import(
      "@/models/saving-projects/services/get-saving-projects"
    );
    const projects = await getSavingProjects(session.user.id);
    const project = projects.find((p) => p.id === id);
    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { label, targetAmount, deadline } = body;

    const updates: {
      label?: string;
      targetAmount?: number | null;
      deadline?: string | null;
    } = {};
    if (label != null) updates.label = String(label).trim();
    if (targetAmount !== undefined) {
      updates.targetAmount =
        targetAmount != null && !isNaN(Number(targetAmount))
          ? Math.max(0, Number(targetAmount))
          : null;
    }
    if (deadline !== undefined) updates.deadline = deadline || null;

    const project = await updateSavingProject(session.user.id, id, updates);

    if (!project) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  try {
    const deleted = await deleteSavingProject(session.user.id, id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Projet non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
