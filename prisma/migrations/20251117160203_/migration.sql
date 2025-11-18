/*
  Warnings:

  - Made the column `phone` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `governorate` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Address" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "governorate" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "streetAddress" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;
