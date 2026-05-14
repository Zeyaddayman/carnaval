-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'ar');

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_lang_key" ON "ProductTranslation"("productId", "lang");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
