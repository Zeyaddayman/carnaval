-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "OrderProduct_orderId_fkey" TO "OrderItem_orderId_fkey";

-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "OrderProduct_productId_fkey" TO "OrderItem_productId_fkey";

-- RenameForeignKey
ALTER TABLE "OrderItem" RENAME CONSTRAINT "OrderProduct_userId_fkey" TO "OrderItem_userId_fkey";
