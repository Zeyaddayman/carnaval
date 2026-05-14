-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "nameAsSubcategory" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAsSubcategory" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_lang_key" ON "CategoryTranslation"("categoryId", "lang");

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
