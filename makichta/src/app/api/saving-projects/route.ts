import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavingProjects } from "@/models/saving-projects/services/get-saving-projects";
import { createSavingProject } from "@/models/saving-projects/services/create-saving-project";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const projects = await getSavingProjects(session.user.id);
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des projets" },
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
    const { label, targetAmount, deadline } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Libellé requis" },
        { status: 400 }
      );
    }

    const project = await createSavingProject(session.user.id, {
      label: String(label).trim(),
      targetAmount:
        targetAmount != null && !isNaN(Number(targetAmount))
          ? Math.max(0, Number(targetAmount))
          : null,
      deadline: deadline || null,
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du projet" },
      { status: 500 }
    );
  }
}
