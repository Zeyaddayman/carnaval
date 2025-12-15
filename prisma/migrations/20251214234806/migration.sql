-- RenameForeignKey
ALTER TABLE "Category" RENAME CONSTRAINT "Category_parentId_fkey" TO "Category_parentCategoryId_fkey";
