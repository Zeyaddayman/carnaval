import { cache as reactCache } from "react"
import { db } from "@/utils/prisma"
import { isAuthenticated } from "../utils/auth"
import { redirect } from "next/navigation"

export const getProfile = reactCache(async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/profile")
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