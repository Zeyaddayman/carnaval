import { Translation } from "@/types/translation"
import * as z from "zod"

export const getAddNewAddressSchema = (translation: Translation["validation"]) => {
    return z.object({
        label: z
            .string()
            .trim()
            .min(1, translation.addressLabelRequired)
        ,
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
        country: z
            .string()
            .trim()
            .min(1, translation.countryRequired)
        ,
        governorate: z
            .string()
            .trim()
            .min(1, translation.governorateRequired)
        ,
        city: z
            .string()
            .trim()
            .min(1, translation.cityRequired)
        ,
        streetAddress: z
            .string()
            .trim()
            .min(1, translation.streetAddressRequired)
    })
}

export const getEditAddressSchema = getAddNewAddressSchema