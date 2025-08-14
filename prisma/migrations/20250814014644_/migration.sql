-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_brandId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
