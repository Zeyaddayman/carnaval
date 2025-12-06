import * as z from "zod"

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