/*
  Warnings:

  - You are about to drop the column `description` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_title_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "description",
DROP COLUMN "title";
