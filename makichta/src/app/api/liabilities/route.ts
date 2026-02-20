import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLiabilities } from "@/models/liabilities/services/get-liabilities";
import { createLiability } from "@/models/liabilities/services/create-liability";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  try {
    const liabilities = await getLiabilities(session.user.id);
    return NextResponse.json(liabilities);
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
    const { label, amount, date, note } = body;
    if (!label || amount == null || !date) {
      return NextResponse.json(
        { error: "Libellé, montant et date requis" },
        { status: 400 }
      );
    }
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      return NextResponse.json(
        { error: "Montant invalide" },
        { status: 400 }
      );
    }
    const dateStr = String(date).trim();
    const dateObj = new Date(dateStr);
    if (Number.isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: "Date invalide" },
        { status: 400 }
      );
    }
    const liability = await createLiability(session.user.id, {
      label: String(label).trim(),
      amount: amountNum,
      date: dateStr,
      note: note != null ? String(note).trim() || null : undefined,
    });
    return NextResponse.json(liability);
  } catch (err) {
    console.error("POST /api/liabilities", err);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
