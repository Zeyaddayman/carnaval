import { Prisma } from "@/generated/prisma";

export const menuCategorySelector = {
    name: true,
    slug: true,
    thumbnail: true,
    subcategories: {
        select: {
            name: true,
            slug: true,
            thumbnail: true,
            nameAsSubcategory: true
        }
    }
} satisfies Prisma.CategorySelect

export const subcategorySelector = {
    name: true,
    slug: true,
    _count: {
        select: {
            products: true
        }
    }
} satisfies Prisma.CategorySelect