import { Language, Prisma } from "@/generated/prisma";

export const tableOrderSelector = {
    id: true,
    count: true,
    createdAt: true,
    itemsCount: true,
    status: true
} satisfies Prisma.OrderSelect

export const orderDetailsSelector = (lang: Language) => ({
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
    items: {
        select: {
            price: true,
            quantity: true,
            product: {
                select: {
                    id: true,
                    translation: {
                        where: {
                            OR: [ { lang }, { lang: "en" } ]
                        },
                        select: { title: true, lang: true }
                    },
                    thumbnail: true
                }
            }
        }
    }
}) satisfies Prisma.OrderSelect