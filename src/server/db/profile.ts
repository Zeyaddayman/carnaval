import { cache as reactCache } from "react"
import { db } from "@/lib/prisma";
import { isAuthenticated } from "./auth";

export const getProfile = reactCache(async () => {

    const session = await isAuthenticated()

    if (!session) {
        throw new Error("User is not authenticated")
    }

    const id = session.userId

    const user = await db.user.findUnique({
        where: { id },
        select: {
            name: true,
            email: true,
            phone: true
        }
    })

    if (!user) {
        throw new Error(`User with id "${id}" not found`)
    }

    return user
})

export const getUserAddresses = async () => {
    const session = await isAuthenticated()

    if (!session) {
        throw new Error("User is not authenticated")
    }

    const id = session.userId

    const addresses = await db.address.findMany({
        where: { userId: id },
        orderBy: [
            { default: "desc" },
            { createdAt: "desc" }
        ]
    })

    return addresses
}