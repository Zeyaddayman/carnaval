import { Translation } from "@/types/translation"
import * as z from "zod"

export const getEditProfileSchema = (translation: Translation["validation"]) => {
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
    })
}