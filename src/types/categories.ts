import { Prisma } from "@/generated/prisma";
import { menuCategorySelector } from "@/server/query-selectors/category";

export type CategoryHierarchy = { name: string; subCategoryName: string; link: string }[]

export type MenuCategory = Prisma.CategoryGetPayload<{
    select: typeof menuCategorySelector
}>