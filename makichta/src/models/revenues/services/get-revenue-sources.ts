import { prisma } from "@/lib/db";
import type { RevenueSource } from "../types/revenue-source";

export async function getRevenueSources(userId: string): Promise<RevenueSource[]> {
  const rows = await prisma.revenueSource.findMany({
    where: { userId },
    orderBy: { label: "asc" },
  });

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    frequency: r.frequency as "RECURRING" | "ONE_TIME",
    recurrenceInterval: r.recurrenceInterval as
      | "WEEKLY"
      | "MONTHLY"
      | "YEARLY"
      | null,
  }));
}
