import { cache as reactCache } from "react"
import { db } from "@/lib/prisma"
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

export const getUserAddresses = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/profile")
    }

    const { userId } = session

    const addresses = await db.address.findMany({
        where: { userId },
        orderBy: [
            { default: "desc" },
            { createdAt: "desc" }
        ]
    })

    return addresses
}

export const getUserDefaultAddress = async () => {

    const session = await isAuthenticated()

    if (!session) {
        redirect("/auth/login?redirect=/profile")
    }

    const { userId } = session

    const defaultAddress = await db.address.findFirst({
        where: {
            userId,
            default: true
        }
    })

    return defaultAddress
}