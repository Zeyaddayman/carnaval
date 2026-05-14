-- Rename the table
ALTER TABLE "OrderProduct" RENAME TO "OrderItem";

-- Rename the foreign key constraint if needed
ALTER INDEX "OrderProduct_pkey" RENAME TO "OrderItem_pkey";