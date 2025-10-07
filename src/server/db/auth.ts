import { cookies } from "next/headers";
import { verifyToken } from "../tokens";

export const isAuthenticated = async () => {
    const accessToken = (await cookies()).get('accessToken');
    const session = verifyToken(accessToken?.value || "")

    return session
}