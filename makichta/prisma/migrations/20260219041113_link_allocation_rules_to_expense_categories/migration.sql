-- CreateTable
CREATE TABLE "_AllocationRuleToExpenseCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllocationRuleToExpenseCategory_AB_unique" ON "_AllocationRuleToExpenseCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AllocationRuleToExpenseCategory_B_index" ON "_AllocationRuleToExpenseCategory"("B");

-- AddForeignKey
ALTER TABLE "_AllocationRuleToExpenseCategory" ADD CONSTRAINT "_AllocationRuleToExpenseCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "AllocationRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllocationRuleToExpenseCategory" ADD CONSTRAINT "_AllocationRuleToExpenseCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ExpenseCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
