import * as z from "zod"

export const addNewAddressSchema = z.object({
    label: z
        .string()
        .trim()
        .min(1, "Address label is required")
    ,
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
    country: z
        .string()
        .trim()
        .min(1, "Country is required")
    ,
    governorate: z
        .string()
        .trim()
        .min(1, "Governorate is required")
    ,
    city: z
        .string()
        .trim()
        .min(1, "City is required")
    ,
    streetAddress: z
        .string()
        .trim()
        .min(1, "Street address is required")
})

export const editAddressSchema = addNewAddressSchema