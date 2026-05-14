import { db } from "@/lib/prisma"
import { isAuthenticated } from "../utils/auth"
import { redirect } from "next/navigation"
import { checkoutItemSelector } from "../query-selectors/checkout"
import { getLanguage } from "@/utils/language"

export const getCheckoutItems = async () => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])
    
    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/checkout`)
    }

    const { userId } = session

    const cart = await db.cart.findUnique({
        where: { userId },
        select: {
            items: {
                select: checkoutItemSelector(lang),
                orderBy: { createdAt: "desc" }
            }
        }
    })

    const checkoutItems = cart?.items.map(item => {

        const productTranslation = item.product.translation.find(trans => trans.lang === lang) || item.product.translation.find(trans => trans.lang === "en")!

        return {
            ...item,
            product: {
                title: productTranslation.title,
                thumbnail: item.product.thumbnail,
                finalPrice: item.product.finalPrice
            }
        }
    })

    return checkoutItems
}