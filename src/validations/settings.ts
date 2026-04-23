import { Translation } from "@/types/translation"
import * as z from "zod"

export const getChangePasswordSchema = (translation: Translation["validation"]) => {
    return z.object({
        newPassword: z
            .string()
            .min(6, translation.passwordMinLength)
            .max(40, translation.passwordMaxLength)
        ,
        confirmNewPassword: z.string()

    }).refine((data) => data.newPassword === data.confirmNewPassword, {
        message: translation.passwordMismatch,
        path: ["confirmNewPassword"]
    })
}