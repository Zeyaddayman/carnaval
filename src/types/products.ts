import { Prisma } from "@/generated/prisma"

export type CardProduct = Prisma.ProductGetPayload<{
    select: {
        id: true,
        title: true,
        thumbnail: true,
        price: true,
        discountPercentage: true,
        rating: true,
        brand: {
            select: {
                name: true
            }
        }
    }
}>