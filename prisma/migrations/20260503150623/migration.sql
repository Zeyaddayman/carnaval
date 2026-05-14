-- CreateTable
CREATE TABLE "BrandTranslation" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "BrandTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandTranslation_brandId_lang_key" ON "BrandTranslation"("brandId", "lang");

-- AddForeignKey
ALTER TABLE "BrandTranslation" ADD CONSTRAINT "BrandTranslation_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
