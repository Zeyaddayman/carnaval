import * as z from "zod"

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
    ,
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
    ,
    email: z
        .email("Must be a valid email")
    ,
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must be at most 40 characters")
    ,
    confirmPassword: z.string()

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})


export const loginSchema = z.object({
    email: z
        .email("Must be a valid email")
    ,
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must be at most 40 characters")
})