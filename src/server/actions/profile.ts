"use server"

import { editProfileSchema } from "@/validations/profile"
import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ACCESS_TOKEN_EXPIRY, clearToken, generateAccessToken, setToken } from "../utils/tokens"
import { formatErrors } from "@/utils/formatters"

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

        const errors = formatErrors(result.error.issues)

        return {
            errors,
            formData,
            status: 400
        }
    }

    try {
        const session = await isAuthenticated()

        if (!session) {
            return {
                message: "Unauthorized",
                status: 401,
                formData
            }
        }

        const { userId } = session

        const userExist = await db.user.findUnique({
            where: { id: userId }
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
            where: { id: userId },
            data: {
                name,
                phone
            }
        })

        await clearToken("accessToken")

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, { maxAge: ACCESS_TOKEN_EXPIRY })

        return {
            message: "Profile updated successfully",
            status: 200,
        }
    }
    catch {
        return {
            message: "Failed to update profile",
            status: 500,
            formData
        }
    }
    finally {
        revalidatePath("/profile")
    }
}