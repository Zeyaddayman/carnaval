/*
  Warnings:

  - You are about to drop the column `name` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameAsSubcategory` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Brand_name_key";

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
DROP COLUMN "nameAsSubcategory";
