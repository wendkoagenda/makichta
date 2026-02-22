-- AlterTable
ALTER TABLE "SavingGoal" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "SavingGoal_userId_status_idx" ON "SavingGoal"("userId", "status");
