"use server"

import { db } from "@/lib/prisma"
import { registerSchema } from "@/validations/auth"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import { ACCESS_TOKEN_EXPIRY, generateAccessToken, setToken } from "../tokens"

export interface RegisterState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const register = async (
    prevState: RegisterState,
    formData: FormData,

): Promise<RegisterState> => {

    const formObject = Object.fromEntries(formData.entries())

    const result = registerSchema.safeParse(formObject)

    if (!result.success) {

        const errors = result.error.issues.reduce<{ [error: string]: string }>((acc, current) => {
            const error = String(current.path)

            if (!acc[error]) acc[error] = current.message

            return acc
        }, {})

        return {
            errors,
            formData,
            status: 400
        }
    }

    try {
        const { name, email, password } = result.data

        const userExist = await db.user.findUnique({
            where: { email }
        })

        if (userExist) {
            return {
                message: "user already exists",
                status: 409,
                formData
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, ACCESS_TOKEN_EXPIRY)

        return {
            status: 201,
            message: "Account created successfully"
        }
    } catch {
        return {
            message: "An unexpected error occurred",
            status: 500,
            formData
        }
    }
}