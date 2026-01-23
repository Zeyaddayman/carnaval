"use server"

import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { formatErrors } from "@/utils/formatters"
import { changePasswordSchema } from "@/validations/settings"

export interface ChangePasswordState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const changePasswordAction = async (
    prevState: ChangePasswordState,
    formData: FormData,

): Promise<ChangePasswordState> => {

    const formObject = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword"),
        confirmNewPassword: formData.get("confirmNewPassword"),
    }

    const result = changePasswordSchema.safeParse(formObject)

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

        const isPasswordValid = await bcrypt.compare(formObject.currentPassword, userExist.password)

        if (!isPasswordValid) {
            return {
                status: 400,
                formData,
                errors: { currentPassword: "Incorrect current password" }
            }
        }

        const { newPassword } = result.data

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return {
            message: "Password changed successfully",
            status: 200,
        }
    }
    catch {
        return {
            message: "Failed to update password",
            status: 500,
            formData
        }
    }
}