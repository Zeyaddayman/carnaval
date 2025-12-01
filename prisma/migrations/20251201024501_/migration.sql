/*
  Warnings:

  - Added the required column `price` to the `OrderProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "count" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderProduct" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
