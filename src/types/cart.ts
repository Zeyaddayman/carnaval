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

export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: {
                    include: {
                        categories: true,
                        brand: true
                    }
                }
            }
        }
    }
}>