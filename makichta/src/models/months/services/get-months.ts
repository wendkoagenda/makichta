import { prisma } from "@/lib/db";
import type { Month } from "../types/month";

/**
 * Retourne l'ID du mois (format "YYYY-MM") à partir d'une date.
 */
export function getMonthIdFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Retourne l'ID du mois courant.
 */
export function getCurrentMonthId(): string {
  return getMonthIdFromDate(new Date());
}

/**
 * Liste tous les mois de la table Month (pour les pickers).
 */
export async function getAllMonths(): Promise<Month[]> {
  const rows = await prisma.month.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    year: r.year,
    month: r.month,
  }));
}

/**
 * Récupère un mois par son ID.
 */
export async function getMonthById(id: string): Promise<Month | null> {
  const row = await prisma.month.findUnique({
    where: { id },
  });
  if (!row) return null;
  return {
    id: row.id,
    label: row.label,
    year: row.year,
    month: row.month,
  };
}
