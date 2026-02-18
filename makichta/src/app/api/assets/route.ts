import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAssets } from "@/models/assets/services/get-assets";
import { createAsset } from "@/models/assets/services/create-asset";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  try {
    const assets = await getAssets(session.user.id);
    return NextResponse.json(assets);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
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
    const { label, purchaseValue, depreciationDurationMonths, acquisitionDate } = body;
    if (!label || purchaseValue == null || depreciationDurationMonths == null || !acquisitionDate) {
      return NextResponse.json(
        { error: "Libellé, valeur d'achat, durée et date requis" },
        { status: 400 }
      );
    }
    const asset = await createAsset(session.user.id, {
      label: String(label).trim(),
      purchaseValue: Number(purchaseValue),
      depreciationDurationMonths: Math.max(1, Number(depreciationDurationMonths)),
      acquisitionDate: String(acquisitionDate),
    });
    return NextResponse.json(asset);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
