import { User } from "@/generated/prisma";
import { UserSession } from "@/types/user";
import jwt from "jsonwebtoken"
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET!
export const ACCESS_TOKEN_EXPIRY = 60 * 60 * 24;

export function generateAccessToken(user: User) {
    return jwt.sign(
        { userId: user.id, email: user.email, name: user.name, role: user.role },
        SECRET_KEY,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}

export async function setToken(name: string, token: string, options?: Partial<ResponseCookie>) {

    const cookiesStore = await cookies()

    cookiesStore.set(name, token, options)
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET_KEY) as UserSession;
    } catch {
        return null
    }
}

export async function clearToken(name: string) {
    const cookiesStore = await cookies()

    cookiesStore.delete(name)
}