"use server"

import { isAuthenticated } from "../utils/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { formatErrors } from "@/utils/formatters"
import { getAddNewAddressSchema, getEditAddressSchema } from "@/validations/address"
import getTranslation from "@/utils/translation"
import { getLanguage } from "@/utils/language"

export interface AddNewAddressState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const addNewAddressAction = async (
    prevState: AddNewAddressState,
    formData: FormData

): Promise<AddNewAddressState> => {

    const formObject = Object.fromEntries(formData.entries())

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    const addNewAddressSchema = getAddNewAddressSchema(translation.validation)

    const result = addNewAddressSchema.safeParse(formObject)

    let isDefault = formObject.default === "on"

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
            where: { id: userId },
            select: { addresses: true }
        })

        if (!userExist) {
            return {
                message: translation.messages.auth.userNotFound,
                status: 404,
                formData
            }
        }

        const { label, name, phone, country, governorate, city, streetAddress } = result.data

        const addressExist = await db.address.findUnique({
            where: {
                userId_label: {
                    userId,
                    label
                }
            }
        })

        if (addressExist) {
            return {
                status: 400,
                formData,
                errors: { label: translation.validation.addressExist }
            }
        }

        if (isDefault) {
            // Set all other addresses to non-default
            await db.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            })
        }

        // Force this address to be default if it's the first one
        isDefault = userExist.addresses.length === 0 ? true : isDefault

        await db.address.create({
            data: {
                userId,
                label: label.toLowerCase(),
                name,
                phone,
                country,
                governorate,
                city,
                streetAddress,
                isDefault
            }
        })

        return {
            message: translation.messages.address.addressAdded,
            status: 201
        }
    }
    catch {
        return {
            message: translation.messages.address.addressAddFailed,
            status: 500,
            formData
        }
    }
    finally {
        revalidatePath("/profile")
        revalidatePath("/checkout")
    }
}

export interface EditAddressState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const editAddressAction = async (
    addressId: string,
    prevState: EditAddressState,
    formData: FormData

): Promise<EditAddressState> => {

    const formObject = Object.fromEntries(formData.entries())

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    const editAddressSchema = getEditAddressSchema(translation.validation)

    const result = editAddressSchema.safeParse(formObject)

    let isDefault = formObject.default === "on"

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

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                addresses: {
                    where: { id: { not: addressId } },
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!user) {
            return {
                message: translation.messages.auth.userNotFound,
                status: 404,
                formData
            }
        }

        const { label, name, phone, country, governorate, city, streetAddress } = result.data

        const addressExist = await db.address.findUnique({
            where: {
                userId_label: {
                    userId,
                    label
                },
                NOT: { id: addressId }
            }
        })

        if (addressExist) {
            return {
                status: 400,
                formData,
                errors: { label: translation.validation.addressExist }
            }
        }

        if (isDefault) {
            // Set all other addresses to non-default
            await db.address.updateMany({
                where: { userId },
                data: { isDefault: false }
            })
        }
        else {
            const defaultAddress = await db.address.findFirst({
                where: {
                    AND: [
                        { userId },
                        { isDefault: true },
                        { id: { not: addressId } }
                    ]
                }
            })

            if (!defaultAddress) {
                // Set the last added one as default if no other default address exists
                const userAddresses = user.addresses

                const lastAddedAddress = userAddresses[0]

                if (lastAddedAddress) {
                    await db.address.update({
                        where: { id: lastAddedAddress.id },
                        data: { isDefault: true }
                    })
                }
                else {
                    // If this is the only address, force it to be default
                    isDefault = true
                }
            }
        }

        await db.address.update({
            where: {
                userId,
                id: addressId
            },
            data: {
                label,
                name,
                phone,
                country,
                governorate,
                city,
                streetAddress,
                isDefault
            }
        })

        return {
            message: translation.messages.address.addressEdited,
            status: 200
        }
    }
    catch {
        return {
            message: translation.messages.address.addressEditFailed,
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}

export const deleteAddressAction = async (addressId: string) => {

    const lang = await getLanguage()

    const [session, translation] = await Promise.all([isAuthenticated(), getTranslation(lang)])

    if (!session) {
        return {
            message: translation.messages.auth.unauthorized,
            status: 401
        }
    }

    try {

        const { userId } = session

        const userExist = await db.user.findUnique({
            where: { id: userId }
        })

        if (!userExist) {
            return {
                message: translation.messages.auth.userNotFound,
                status: 404,
            }
        }

        await db.address.delete({
            where: {
                userId,
                id: addressId
            }
        })

        const defaultAddress = await db.address.findFirst({
            where: {
                userId,
                isDefault: true
            }
        })

        if (!defaultAddress) {

            const lastAddedAddress = await db.address.findFirst({
                where: { userId },
                orderBy: { createdAt: "desc" }
            })

            if (lastAddedAddress) {
                await db.address.update({
                    where: { id: lastAddedAddress.id },
                    data: { isDefault: true }
                })
            }
        }

        return {
            message: translation.messages.address.addressDeleted,
            status: 200
        }
    }
    catch {
        return {
            message: translation.messages.address.addressDeleteFailed,
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}

export const setAddressAsDefaultAction = async (addressId: string) => {

    const lang = await getLanguage()

    const [session, translation] = await Promise.all([isAuthenticated(), getTranslation(lang)])

    if (!session) {
        return {
            message: translation.messages.auth.unauthorized,
            status: 401
        }
    }

    try {

        const { userId } = session

        const userExist = await db.user.findUnique({
            where: { id: userId }
        })

        if (!userExist) {
            return {
                message: translation.messages.auth.userNotFound,
                status: 404,
            }
        }

        await db.address.updateMany({
            where: { userId },
            data: { isDefault: false }
        })

        await db.address.update({
            where: {
                userId,
                id: addressId
            },
            data: { isDefault: true }
        })

        return {
            message: translation.messages.address.addressSetAsDefault,
            status: 200
        }
    }
    catch {
        return {
            message: translation.messages.address.addressSetAsDefaultFailed,
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}