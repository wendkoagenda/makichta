import { prisma } from "@/lib/db";
import { UserSettings, DEFAULT_SETTINGS } from "../types/user-settings";

export async function getSettings(userId: string): Promise<UserSettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      currency: true,
      periodReference: true,
    },
  });

  if (!user) return DEFAULT_SETTINGS;

  return {
    currency: user.currency,
    periodReference: user.periodReference,
  };
}
