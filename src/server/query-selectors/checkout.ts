import { Language, Prisma } from "@/generated/prisma"

export const checkoutItemSelector = (lang: Language) => ({
    id: true,
    quantity: true,
    product: {
        select: {
            translation: {
                where: {
                    OR: [ { lang }, { lang: "en" } ]
                },
                select: { title: true, lang: true }
            },
            thumbnail: true,
            finalPrice: true
        }
    }
}) satisfies Prisma.CartItemSelect