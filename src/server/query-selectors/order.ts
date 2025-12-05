import { Prisma } from "@/generated/prisma";

export const tableOrderSelector = {
    id: true,
    count: true,
    createdAt: true,
    itemsCount: true,
    status: true
} satisfies Prisma.OrderSelect

export const orderDetailsSelector = {
    count: true,
    status: true,
    createdAt: true,
    itemsCount: true,
    subtotal: true,
    shippingFee: true,
    totalPrice: true,
    userName: true,
    userPhone: true,
    country: true,
    governorate: true,
    city: true,
    streetAddress: true,
    products: {
        select: {
            price: true,
            quantity: true,
            product: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true
                }
            }
        }
    }
} satisfies Prisma.OrderSelect