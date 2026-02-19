import { prisma } from "@/lib/db";

/**
 * Supprime un projet. Les objectifs (SavingGoal) liés passent en projectId = null
 * grâce à onDelete: SetNull sur la relation.
 */
export async function deleteSavingProject(
  userId: string,
  id: string
): Promise<boolean> {
  const result = await prisma.savingProject.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
}
