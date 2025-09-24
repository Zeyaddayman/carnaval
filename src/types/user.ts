import { User } from "@/generated/prisma";

export interface UserSession {
    userId: User["id"]
    email: User["email"]
    role: User["role"]
    iat: number
    exp: number
}