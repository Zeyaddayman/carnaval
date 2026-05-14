import { Prisma } from "@/generated/prisma";
import { Language } from "@/generated/prisma";

export const getMenuCategorySelector = (lang: Language) => ({
    slug: true,
    thumbnail: true,
    subcategories: {
        select: {
            slug: true,
            thumbnail: true,
            translation: {
                where: {
                    OR: [
                        { lang },
                        { lang: "en" }
                    ]
                },
                select: {
                    lang: true,
                    name: true,
                    nameAsSubcategory: true
                }
            }
        }
    },
    translation: {
        where: {
            OR: [
                { lang },
                { lang: "en" }
            ]
        },
        select: {
            lang: true,
            name: true
        }
    }
}) satisfies Prisma.CategorySelect

export const subcategorySelector = (lang: Language) => ({
    slug: true,
    translation: {
        where: {
            OR: [
                { lang },
                { lang: "en" }
            ]
        },
        select: { name: true, lang: true }
    },
    _count: {
        select: {
            products: true
        }
    }
}) satisfies Prisma.CategorySelect