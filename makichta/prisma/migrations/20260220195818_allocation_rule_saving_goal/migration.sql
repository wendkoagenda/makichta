-- AlterTable
ALTER TABLE "AllocationRule" ADD COLUMN     "savingGoalId" TEXT;

-- CreateIndex
CREATE INDEX "AllocationRule_savingGoalId_idx" ON "AllocationRule"("savingGoalId");

-- AddForeignKey
ALTER TABLE "AllocationRule" ADD CONSTRAINT "AllocationRule_savingGoalId_fkey" FOREIGN KEY ("savingGoalId") REFERENCES "SavingGoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
