import { redirect } from "next/navigation"
import { isAuthenticated } from "../utils/auth"
import { db } from "@/utils/prisma"

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