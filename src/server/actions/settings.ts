"use server"

import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { formatErrors } from "@/utils/formatters"
import { getChangePasswordSchema } from "@/validations/settings"
import { getLanguage } from "@/utils/language"
import getTranslation from "@/utils/translation"

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

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    const changePasswordSchema = getChangePasswordSchema(translation.validation)

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
                message: translation.messages.auth.unauthorized,
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
                message: translation.messages.auth.userNotFound,
                status: 404,
                formData
            }
        }

        const isPasswordValid = await bcrypt.compare(formObject.currentPassword, userExist.password)

        if (!isPasswordValid) {
            return {
                status: 400,
                formData,
                errors: { currentPassword: translation.validation.passwordIncorrect }
            }
        }

        const { newPassword } = result.data

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return {
            message: translation.messages.profile.passwordChanged,
            status: 200,
        }
    }
    catch {
        return {
            message: translation.messages.profile.passwordChangeFailed,
            status: 500,
            formData
        }
    }
}