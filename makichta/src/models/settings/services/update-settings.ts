import { prisma } from "@/lib/db";
import { UserSettings } from "../types/user-settings";

export async function updateSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      currency: settings.currency,
      periodReference: settings.periodReference,
    },
    select: {
      currency: true,
      periodReference: true,
    },
  });

  return {
    currency: user.currency,
    periodReference: user.periodReference,
  };
}
