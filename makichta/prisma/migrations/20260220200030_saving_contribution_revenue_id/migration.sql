-- AlterTable
ALTER TABLE "SavingContribution" ADD COLUMN     "revenueId" TEXT;

-- CreateIndex
CREATE INDEX "SavingContribution_revenueId_idx" ON "SavingContribution"("revenueId");
