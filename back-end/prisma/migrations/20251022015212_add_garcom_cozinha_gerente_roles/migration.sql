-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."UserRole" ADD VALUE 'GARCOM';
ALTER TYPE "public"."UserRole" ADD VALUE 'COZINHA';
ALTER TYPE "public"."UserRole" ADD VALUE 'GERENTE';
