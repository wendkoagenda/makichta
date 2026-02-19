-- AlterTable
ALTER TABLE "SavingGoal" ADD COLUMN     "projectId" TEXT;

-- CreateTable
CREATE TABLE "SavingProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavingProject_userId_idx" ON "SavingProject"("userId");

-- CreateIndex
CREATE INDEX "SavingGoal_projectId_idx" ON "SavingGoal"("projectId");

-- AddForeignKey
ALTER TABLE "SavingProject" ADD CONSTRAINT "SavingProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingGoal" ADD CONSTRAINT "SavingGoal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "SavingProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
