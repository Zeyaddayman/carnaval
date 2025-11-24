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

export const changePasswordSchema = z.object({
    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must be at most 40 characters")
    ,
    confirmNewPassword: z.string()

}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"]
})