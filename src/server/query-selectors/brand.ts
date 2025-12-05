import { Prisma } from "@/generated/prisma";

export const brandWithProductsCountSelector = {
    id: true,
    name: true,
    slug: true,
    thumbnail: true,
    _count: {
        select: {
            products: {
                where: {
                    stock: { gt: 0 }
                }
            }
        }
    }
} satisfies Prisma.BrandSelect