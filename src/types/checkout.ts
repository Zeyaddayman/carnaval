import { Prisma } from "@/generated/prisma";

export type CheckoutItem = Prisma.CartItemGetPayload<{
    select: {
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
    }
}>