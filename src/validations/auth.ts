import { Translation } from "@/types/translation"
import * as z from "zod"

export const getRegisterSchema = (translation: Translation["validation"]) => {
    return z.object({
        name: z
            .string()
            .trim()
            .min(1, translation.nameRequired)
        ,
        phone: z
            .string()
            .min(10, translation.phoneMinLength)
            .max(15, translation.phoneMaxLength)
        ,
        email: z
            .email(translation.validEmail)
        ,
        password: z
            .string()
            .min(6, translation.passwordMinLength)
            .max(40, translation.passwordMaxLength)
        ,
        confirmPassword: z.string()

    }).refine((data) => data.password === data.confirmPassword, {
        message: translation.passwordMismatch,
        path: ["confirmPassword"]
    })
}

export const getLoginSchema = (translation: Translation["validation"]) => {
    return z.object({
        email: z
            .email(translation.validEmail)
        ,
        password: z
            .string()
            .min(6, translation.passwordMinLength)
            .max(40, translation.passwordMaxLength)
    })
}