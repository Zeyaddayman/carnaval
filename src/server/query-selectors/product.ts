import { Prisma } from "@/generated/prisma";
import { Language } from "@/generated/prisma";

export const cardProductSelector = (lang: Language) => ({
    id: true,
    thumbnail: true,
    price: true,
    discountPercentage: true,
    finalPrice: true,
    rating: true,
    stock: true,
    limit: true,
    translation: {
        where: {
            OR: [ { lang }, { lang: "en" } ]
        },
        select: { title: true, lang: true }
    },
    brand: {
        select: {
            translation: {
                where: {
                    OR: [ { lang }, { lang: "en" } ]
                },
                select: { name: true, lang: true }
            }
        }
    }
}) satisfies Prisma.ProductSelect

export const productDetailsSelector = (lang: Language) => ({
    id: true,
    thumbnail: true,
    price: true,
    discountPercentage: true,
    finalPrice: true,
    rating: true,
    stock: true,
    limit: true,
    images: true,
    translation: {
        where: {
            OR: [ { lang }, { lang: "en" } ]
        },
        select: { title: true, description: true, lang: true }
    },
    categories: {
        select: {
            slug: true,
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
    brand: {
        select: {
            translation: {
                where: {
                    OR: [ { lang }, { lang: "en" } ]
                },
                select: { name: true, lang: true }
            }
        }
    }
}) satisfies Prisma.ProductSelect