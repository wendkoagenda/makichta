-- AlterTable
ALTER TABLE "AllocationRule" ADD COLUMN     "allocationType" TEXT NOT NULL DEFAULT 'PERCENT',
ADD COLUMN     "amount" DOUBLE PRECISION,
ALTER COLUMN "percentage" SET DEFAULT 0;
