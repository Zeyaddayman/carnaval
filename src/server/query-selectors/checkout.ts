import { Prisma } from "@/generated/prisma"

export const checkoutItemSelector = {
    id: true,
    quantity: true,
    product: {
        select: {
            title: true,
            thumbnail: true,
            price: true,
            discountPercentage: true
        }
    }
} satisfies Prisma.CartItemSelect