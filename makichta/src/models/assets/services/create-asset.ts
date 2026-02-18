import { prisma } from "@/lib/db";
import type { CreateAssetInput, Asset } from "../types/asset";

export async function createAsset(
  userId: string,
  input: CreateAssetInput
): Promise<Asset> {
  const row = await prisma.asset.create({
    data: {
      userId,
      label: input.label,
      purchaseValue: Math.max(0, input.purchaseValue),
      depreciationDurationMonths: Math.max(1, input.depreciationDurationMonths),
      acquisitionDate: new Date(input.acquisitionDate),
    },
  });

  return {
    id: row.id,
    label: row.label,
    purchaseValue: row.purchaseValue,
    depreciationDurationMonths: row.depreciationDurationMonths,
    acquisitionDate: row.acquisitionDate.toISOString().slice(0, 10),
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}
