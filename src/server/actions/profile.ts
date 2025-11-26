"use server"

import { addNewAddressSchema, changePasswordSchema, editProfileSchema } from "@/validations/profile"
import { isAuthenticated } from "../db/auth"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ACCESS_TOKEN_EXPIRY, clearToken, generateAccessToken, setToken } from "../tokens"
import bcrypt from "bcrypt"

export interface EditProfileState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const editProfileAction = async (
    prevState: EditProfileState,
    formData: FormData,

): Promise<EditProfileState> => {

    const formObject = Object.fromEntries(formData.entries())

    const result = editProfileSchema.safeParse(formObject)

    if (!result.success) {

        const errors = result.error.issues.reduce<{ [error: string]: string }>((acc, current) => {
            const error = String(current.path)

            if (!acc[error]) acc[error] = current.message

            return acc
        }, {})

        return {
            errors,
            formData,
            status: 400
        }
    }

    try {
        const sesstion = await isAuthenticated()

        if (!sesstion) {
            return {
                message: "Unauthorized",
                status: 401,
                formData
            }
        }

        const userExist = await db.user.findUnique({
            where: { id: sesstion.userId }
        })

        if (!userExist) {
            return {
                message: "User not found",
                status: 404,
                formData
            }
        }

        const { name, phone } = result.data

        const user = await db.user.update({
            where: { id: sesstion.userId },
            data: {
                name,
                phone
            }
        })

        await clearToken("accessToken")

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, ACCESS_TOKEN_EXPIRY)

        return {
            message: "Profile updated successfully",
            status: 200,
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
    }
}


export interface ChangePasswordState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const changePasswordAction = async (
    prevState: ChangePasswordState,
    formData: FormData,

): Promise<ChangePasswordState> => {

    const formObject = {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword"),
        confirmNewPassword: formData.get("confirmNewPassword"),
    }

    const result = changePasswordSchema.safeParse(formObject)

    if (!result.success) {

        const errors = result.error.issues.reduce<{ [error: string]: string }>((acc, current) => {
            const error = String(current.path)

            if (!acc[error]) acc[error] = current.message

            return acc
        }, {})

        return {
            errors,
            formData,
            status: 400
        }
    }

    try {
        const sesstion = await isAuthenticated()

        if (!sesstion) {
            return {
                message: "Unauthorized",
                status: 401,
                formData
            }
        }

        const userExist = await db.user.findUnique({
            where: { id: sesstion.userId }
        })

        if (!userExist) {
            return {
                message: "User not found",
                status: 404,
                formData
            }
        }

        const isPasswordValid = await bcrypt.compare(formObject.currentPassword, userExist.password)

        if (!isPasswordValid) {
            return {
                status: 400,
                formData,
                errors: { currentPassword: "Current password is incorrect" }
            }
        }

        const { newPassword } = result.data

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db.user.update({
            where: { id: sesstion.userId },
            data: { password: hashedPassword }
        })

        return {
            message: "Password changed successfully",
            status: 200,
        }
    }
    catch {
        return {
            message: "An unexpected error occurred",
            status: 500,
            formData
        }
    }
}

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

    const isDefault = formObject.default === "on"

    if (!result.success) {

        const errors = result.error.issues.reduce<{ [error: string]: string }>((acc, current) => {
            const error = String(current.path)

            if (!acc[error]) acc[error] = current.message

            return acc
        }, {})

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

        const userId = session.userId

        const userExist = await db.user.findUnique({
            where: { id: userId }
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
                    default: false
                }
            })
        }

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
                default: isDefault
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

        const userId = session.userId

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

        const userId = session.userId

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
            data: { default: false }
        })

        await db.address.update({
            where: {
                userId,
                id: addressId
            },
            data: { default: true }
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