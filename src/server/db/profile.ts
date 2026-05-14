import { cache as reactCache } from "react"
import { db } from "@/lib/prisma"
import { isAuthenticated } from "../utils/auth"
import { redirect } from "next/navigation"
import { getLanguage } from "@/utils/language"

export const getProfile = reactCache(async () => {

    const [session, lang] = await Promise.all([isAuthenticated(), getLanguage()])

    if (!session) {
        redirect(`/${lang}/auth/login?redirect=/${lang}/profile`)
    }
    const { userId } = session

    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            email: true,
            phone: true
        }
    })

    if (!user) {
        throw new Error(`User with id "${userId}" not found`)
    }

    return user
})