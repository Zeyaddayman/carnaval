import { getTopLevelCategories } from "@/server/db/categories";

export type CategoryHierarchy = { name: string; nameAsSubcategory: string; link: string }[]

export type MenuCategory = Awaited<ReturnType<typeof getTopLevelCategories>>[number]