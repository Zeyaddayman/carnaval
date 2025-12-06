import * as z from "zod"

export const editProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
    ,
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
})