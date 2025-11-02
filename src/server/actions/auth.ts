"use server"

import { db } from "@/lib/prisma"
import { loginSchema, registerSchema } from "@/validations/auth"
import bcrypt from "bcrypt"
import { ACCESS_TOKEN_EXPIRY, generateAccessToken, setToken, verifyToken } from "../tokens"
import { CartItemWithProduct } from "@/types/cart"
import { Prisma } from "@/generated/prisma"
import { mergeCartItems } from "@/lib/utils"

export interface RegisterState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const registerAction = async (
    localCartItems: CartItemWithProduct[],
    prevState: RegisterState,
    formData: FormData,

): Promise<RegisterState> => {

    const formObject = Object.fromEntries(formData.entries())

    const result = registerSchema.safeParse(formObject)

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
        const { name, email, password } = result.data

        const userExist = await db.user.findUnique({
            where: { email }
        })

        if (userExist) {
            return {
                message: "user already exists",
                status: 409,
                formData
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userCartItems = mergeCartItems(localCartItems, [])

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                cart: {
                    create: {
                        items: {
                            createMany: { data: userCartItems }
                        }
                    }
                }
            }
        })

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, ACCESS_TOKEN_EXPIRY)

        return {
            status: 201,
            message: "Account created successfully"
        }
    } catch {
        return {
            message: "An unexpected error occurred",
            status: 500,
            formData
        }
    }
}

export interface LoginState {
    message?: string
    errors?: { [error: string]: string }
    status?: number 
    formData?: FormData
}

export const loginAction = async (
    localCartItems: CartItemWithProduct[],
    prevState: LoginState,
    formData: FormData,

): Promise<LoginState> => {

    const formObject = Object.fromEntries(formData.entries())

    const result = loginSchema.safeParse(formObject)

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
        const { email, password } = result.data

        const user = await db.user.findUnique({
            where: { email },
            include: {
                cart: {
                    include: {
                        items: {
                            include: {
                                product: {
                                    include: { brand: true }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return {
                message: "email or password incorrect. Please try again",
                status: 401,
                formData
            }
        }

        console.log(user.cart)

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return {
                message: "email or password incorrect. Please try again",
                status: 401,
                formData
            }
        }

        const mergedCartItems = mergeCartItems(localCartItems, user.cart?.items || [])

        console.log(mergedCartItems)

        await db.cart.upsert({
            where: { userId: user.id },
            update: {
                items: {
                    deleteMany: {},
                    create: mergedCartItems
                }
            },
            create: {
                userId: user.id,
                items: { create: mergedCartItems }
            }
        })

        const accessToken = generateAccessToken(user)

        await setToken("accessToken", accessToken, ACCESS_TOKEN_EXPIRY)

        return {
            status: 200,
            message: "logged in successfully"
        }
    } catch {
        return {
            message: "An unexpected error occurred",
            status: 500,
            formData
        }
    }
}

