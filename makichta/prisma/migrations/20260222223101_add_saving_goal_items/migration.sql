-- CreateTable
CREATE TABLE "SavingGoalItem" (
    "id" TEXT NOT NULL,
    "savingGoalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingGoalItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavingGoalItem_savingGoalId_idx" ON "SavingGoalItem"("savingGoalId");

-- AddForeignKey
ALTER TABLE "SavingGoalItem" ADD CONSTRAINT "SavingGoalItem_savingGoalId_fkey" FOREIGN KEY ("savingGoalId") REFERENCES "SavingGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
