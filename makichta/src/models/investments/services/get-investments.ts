import { prisma } from "@/lib/db";
import type { Investment } from "../types/investment";

interface GetInvestmentsParams {
  userId: string;
  type?: string;
}

export async function getInvestments({
  userId,
  type,
}: GetInvestmentsParams): Promise<Investment[]> {
  const where: { userId: string; type?: string } = { userId };
  if (type) where.type = type;

  const rows = await prisma.investment.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    amount: r.amount,
    date: r.date.toISOString().slice(0, 10),
    description: r.description,
    createdAt: r.createdAt?.toISOString(),
  }));
}
