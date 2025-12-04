import { cookies } from "next/headers";
import { verifyToken } from "./tokens";
import { cache as reactCache } from "react"

export const isAuthenticated = reactCache(async () => {

    const accessToken = (await cookies()).get('accessToken');
    const session = verifyToken(accessToken?.value || "")

    return session
})