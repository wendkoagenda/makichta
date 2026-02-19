-- CreateTable
CREATE TABLE "Month" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Month_year_month_key" ON "Month"("year", "month");

-- Seed Month (Feb 2026 to Feb 2050)
INSERT INTO "Month" (id, label, year, month)
SELECT
  to_char(d, 'YYYY-MM'),
  to_char(d, 'TMMonth YYYY'),
  EXTRACT(YEAR FROM d)::int,
  EXTRACT(MONTH FROM d)::int
FROM generate_series('2026-02-01'::date, '2050-02-01'::date, '1 month') AS d;

-- AllocationRule: add monthId, backfill from month, drop month
ALTER TABLE "AllocationRule" ADD COLUMN "monthId" TEXT;
UPDATE "AllocationRule" SET "monthId" = "month" WHERE "month" IS NOT NULL;
ALTER TABLE "AllocationRule" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "AllocationRule" DROP COLUMN "month";
ALTER TABLE "AllocationRule" ADD CONSTRAINT "AllocationRule_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "AllocationRule_userId_monthId_idx" ON "AllocationRule"("userId", "monthId");
DROP INDEX IF EXISTS "AllocationRule_userId_month_idx";

-- ExpenseCategory: add monthId, backfill from month, drop month
ALTER TABLE "ExpenseCategory" ADD COLUMN "monthId" TEXT;
UPDATE "ExpenseCategory" SET "monthId" = "month" WHERE "month" IS NOT NULL;
ALTER TABLE "ExpenseCategory" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "ExpenseCategory" DROP COLUMN "month";
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "ExpenseCategory_userId_monthId_idx" ON "ExpenseCategory"("userId", "monthId");
DROP INDEX IF EXISTS "ExpenseCategory_userId_month_idx";

-- Revenue: add monthId, backfill from date
ALTER TABLE "Revenue" ADD COLUMN "monthId" TEXT;
UPDATE "Revenue" SET "monthId" = to_char("date", 'YYYY-MM') WHERE "date" IS NOT NULL;
UPDATE "Revenue" SET "monthId" = '2026-02' WHERE "monthId" IS NULL OR "monthId" NOT IN (SELECT id FROM "Month");
ALTER TABLE "Revenue" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Revenue_monthId_idx" ON "Revenue"("monthId");

-- Expense: add monthId, backfill from date
ALTER TABLE "Expense" ADD COLUMN "monthId" TEXT;
UPDATE "Expense" SET "monthId" = to_char("date", 'YYYY-MM') WHERE "date" IS NOT NULL;
UPDATE "Expense" SET "monthId" = '2026-02' WHERE "monthId" IS NULL OR "monthId" NOT IN (SELECT id FROM "Month");
ALTER TABLE "Expense" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Expense_monthId_idx" ON "Expense"("monthId");

-- Allocation: add monthId, backfill from Revenue
ALTER TABLE "Allocation" ADD COLUMN "monthId" TEXT;
UPDATE "Allocation" a SET "monthId" = r."monthId" FROM "Revenue" r WHERE a."revenueId" = r.id;
UPDATE "Allocation" SET "monthId" = '2026-02' WHERE "monthId" IS NULL OR "monthId" NOT IN (SELECT id FROM "Month");
ALTER TABLE "Allocation" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "Allocation" ADD CONSTRAINT "Allocation_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Allocation_monthId_idx" ON "Allocation"("monthId");

-- SavingContribution: add monthId, backfill from date
ALTER TABLE "SavingContribution" ADD COLUMN "monthId" TEXT;
UPDATE "SavingContribution" SET "monthId" = to_char("date", 'YYYY-MM') WHERE "date" IS NOT NULL;
UPDATE "SavingContribution" SET "monthId" = '2026-02' WHERE "monthId" IS NULL OR "monthId" NOT IN (SELECT id FROM "Month");
ALTER TABLE "SavingContribution" ALTER COLUMN "monthId" SET NOT NULL;
ALTER TABLE "SavingContribution" ADD CONSTRAINT "SavingContribution_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "SavingContribution_monthId_idx" ON "SavingContribution"("monthId");
