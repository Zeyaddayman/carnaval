import { Prisma } from "@/generated/prisma";

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: {
        product: {
            include: {
                categories: true
                brand: true
            }
        }
    }
}>