/*
  Warnings:

  - Changed the type of `lang` on the `BrandTranslation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lang` on the `CategoryTranslation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BrandTranslation" 
ALTER COLUMN "lang" TYPE "Language" 
USING "lang"::text::"Language";

-- AlterTable
ALTER TABLE "CategoryTranslation" 
ALTER COLUMN "lang" TYPE "Language" 
USING "lang"::text::"Language";

DROP INDEX IF EXISTS "BrandTranslation_brandId_lang_key";
CREATE UNIQUE INDEX "BrandTranslation_brandId_lang_key" ON "BrandTranslation"("brandId", "lang");

DROP INDEX IF EXISTS "CategoryTranslation_categoryId_lang_key";
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_lang_key" ON "CategoryTranslation"("categoryId", "lang");