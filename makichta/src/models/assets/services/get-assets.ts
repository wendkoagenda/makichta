import { prisma } from "@/lib/db";
import type { Asset } from "../types/asset";

export async function getAssets(userId: string): Promise<Asset[]> {
  const rows = await prisma.asset.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    purchaseValue: r.purchaseValue,
    depreciationDurationMonths: r.depreciationDurationMonths,
    acquisitionDate: r.acquisitionDate.toISOString().slice(0, 10),
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));
}
