import { redirect } from "next/navigation"
import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import { getLanguage } from "@/utils/language"

export const getUserAddresses = async () => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/profile`)
    }

    const { userId } = session

    const addresses = await db.address.findMany({
        where: { userId },
        orderBy: [
            { isDefault: "desc" },
            { createdAt: "desc" }
        ]
    })

    return addresses
}

export const getUserDefaultAddress = async () => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/profile`)
    }

    const { userId } = session

    const defaultAddress = await db.address.findFirst({
        where: {
            userId,
            isDefault: true
        }
    })

    return defaultAddress
}