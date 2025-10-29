import { Prisma } from "@/generated/prisma"

export type WishlistItem = Prisma.WishlistGetPayload<{
    include: {
        product: {
            select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
                discountPercentage: true,
                rating: true,
                stock: true,
                limit: true,
                brand: {
                    select: {
                        name: true
                    }
                }
            }
        }
    }
}>