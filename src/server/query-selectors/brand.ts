import { Prisma } from "@/generated/prisma";
import { Language } from "@/generated/prisma";

export const brandWithProductsCountSelector = (lang: Language) => ({
    id: true,
    slug: true,
    thumbnail: true,
    translation: {
        where: {
            OR: [
                { lang },
                { lang: "en" }
            ]
        },
        select: { lang: true, name: true }
    },
    _count: {
        select: {
            products: {
                where: {
                    stock: { gt: 0 }
                }
            }
        }
    }
}) satisfies Prisma.BrandSelect