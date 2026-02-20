import { prisma } from "@/lib/db";
import type { Liability } from "../types/liability";

export async function getLiabilities(userId: string): Promise<Liability[]> {
  const rows = await prisma.liability.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    amount: r.amount,
    date: r.date.toISOString().slice(0, 10),
    note: r.note,
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
