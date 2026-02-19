-- Add month column as nullable first for backfill
ALTER TABLE "AllocationRule" ADD COLUMN "month" TEXT;
UPDATE "AllocationRule" SET "month" = to_char(now(), 'YYYY-MM') WHERE "month" IS NULL;
ALTER TABLE "AllocationRule" ALTER COLUMN "month" SET NOT NULL;

ALTER TABLE "ExpenseCategory" ADD COLUMN "month" TEXT;
UPDATE "ExpenseCategory" SET "month" = to_char(now(), 'YYYY-MM') WHERE "month" IS NULL;
ALTER TABLE "ExpenseCategory" ALTER COLUMN "month" SET NOT NULL;

CREATE INDEX "AllocationRule_userId_month_idx" ON "AllocationRule"("userId", "month");
CREATE INDEX "ExpenseCategory_userId_month_idx" ON "ExpenseCategory"("userId", "month");
