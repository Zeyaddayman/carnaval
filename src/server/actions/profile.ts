"use server"

import { editProfileSchema } from "@/validations/profile"
import { isAuthenticated } from "../db/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ACCESS_TOKEN_EXPIRY, clearToken, generateAccessToken, setToken } from "../tokens"

export interface EditProfileState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const editProfileAction = async (
    prevState: EditProfileState,
    formData: FormData,

): Promise<EditProfileState> => {

    const formObject = Object.fromEntries(formData.entries())

    const result = editProfileSchema.safeParse(formObject)

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
        const sesstion = await isAuthenticated()

        if (!sesstion) {
            return {
                message: "Unauthorized",
                status: 401,
                formData
            }
        }

        const userExist = await db.user.findUnique({
            where: { id: sesstion.userId }
        })

        if (!userExist) {
            return {
                message: "User not found",
                status: 404,
                formData
            }
        }

        const { name, phone } = result.data

        const user = await db.user.update({
            where: { id: sesstion.userId },
            data: {
                name,
                phone
            }
        })

        await clearToken("accessToken")

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, ACCESS_TOKEN_EXPIRY)

        return {
            message: "Profile updated successfully",
            status: 200,
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500,
            formData
        }
    }
    finally {
        revalidatePath("/profile")
    }
}