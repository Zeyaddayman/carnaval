"use server"

import { isAuthenticated } from "../utils/auth"
import { db } from "@/utils/prisma"
import { revalidatePath } from "next/cache"
import { formatErrors } from "@/utils/formatters"
import { addNewAddressSchema, editAddressSchema } from "@/validations/address"

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
                message: "Unauthorized",
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
                message: "User not found",
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
                message: "Address already exists",
                status: 400,
                formData,
                errors: { label: "Address with this label already exists" }
            }
        }

        if (isDefault) {
            await db.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            })
        }

        isDefault = userExist.addresses.length === 0 ? true : isDefault

        await db.address.create({
            data: {
                userId,
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
            message: "Address added successfully",
            status: 201
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
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
                message: "Unauthorized",
                status: 401,
                formData
            }
        }

        const { userId } = session

        const userExist = await db.user.findUnique({
            where: { id: userId },
            select: {
                addresses: {
                    orderBy: { createdAt: "desc" }
                }
            }
        })

        if (!userExist) {
            return {
                message: "User not found",
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

        if (addressExist && addressExist.id !== addressId) {
            return {
                message: "Address with this label already exists",
                status: 400,
                formData,
                errors: { label: "Address already exists" }
            }
        }

        if (isDefault) {
            await db.address.updateMany({
                where: {
                    userId
                },
                data: {
                    isDefault: false
                }
            })
        } else {
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

                const userAddresses = userExist.addresses

                let lastAddedAddress

                if (userAddresses.length > 1) {
                    lastAddedAddress = userAddresses.find(address => address.id !== addressId)
                } else {
                    lastAddedAddress = userAddresses[0]
                    isDefault = true
                }

                if (lastAddedAddress) {
                    await db.address.update({
                        where: { id: lastAddedAddress.id },
                        data: { isDefault: true }
                    })
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
            message: "Address updated successfully",
            status: 200
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}

export const deleteAddressAction = async (addressId: string) => {

    const session = await isAuthenticated()

    if (!session) {
        return {
            message: "Unauthorized",
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
                message: "User not found",
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
            message: "Address deleted successfully",
            status: 200
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}

export const setAddressAsDefaultAction = async (addressId: string) => {

    const session = await isAuthenticated()

    if (!session) {
        return {
            message: "Unauthorized",
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
                message: "User not found",
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
            message: "Address set as default successfully",
            status: 200
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500
        }
    }
    finally {
        revalidatePath("/profile")
    }
}