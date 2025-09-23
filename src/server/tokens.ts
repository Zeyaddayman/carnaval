import { User } from "@/generated/prisma";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET!
export const ACCESS_TOKEN_EXPIRY = 60 * 60 * 24;

export function generateAccessToken(user: User) {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}

export async function setToken(name: string, token: string, maxAge: number, httpOnly: boolean = true) {

    const cookiesStore = await cookies()

    cookiesStore.set(name, token, {
        httpOnly,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge, // milliseconds
        path: '/'
    })
}