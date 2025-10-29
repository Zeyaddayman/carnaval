import { Prisma } from "@/generated/prisma";

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
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

export type CartWithItems = Prisma.CartGetPayload<{
    include: {
        items: {
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
        }
    }
}>