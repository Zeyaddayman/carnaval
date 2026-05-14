"use server"

import { db } from "@/lib/prisma"
import { getLoginSchema, getRegisterSchema } from "@/validations/auth"
import bcrypt from "bcrypt"
import { ACCESS_TOKEN_EXPIRY, clearToken, generateAccessToken, setToken } from "../utils/tokens"
import { CartItemWithProduct } from "@/types/cart"
import { mergeCartItems } from "@/utils/cart"
import { formatErrors } from "@/utils/formatters"
import { cartItemSelector } from "../query-selectors/cart"
import { getLanguage } from "@/utils/language"
import getTranslation from "@/utils/translation"

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

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    const registerSchema = getRegisterSchema(translation.validation)

    const result = registerSchema.safeParse(formObject)

    if (!result.success) {

        const errors = formatErrors(result.error.issues)

        return {
            errors,
            formData,
            status: 400
        }
    }

    try {
        const { name, email, phone, password } = result.data

        const userExist = await db.user.findUnique({
            where: { email }
        })

        if (userExist) {
            return {
                message: translation.messages.auth.userExists,
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
                phone,
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

        await setToken("accessToken", accessToken, { maxAge: ACCESS_TOKEN_EXPIRY })

        return {
            status: 201,
            message: translation.messages.auth.accountCreated
        }
    } catch {
        return {
            message: translation.messages.auth.accountCreateFailed,
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

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    const loginSchema = getLoginSchema(translation.validation)

    const result = loginSchema.safeParse(formObject)

    if (!result.success) {

        const errors = formatErrors(result.error.issues)

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
                    select: {
                        items: { select: cartItemSelector(lang) }
                    }
                }
            }
        })

        if (!user) {
            return {
                message: translation.messages.auth.emailOrPasswordIncorrect,
                status: 401,
                formData
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return {
                message: translation.messages.auth.emailOrPasswordIncorrect,
                status: 401,
                formData
            }
        }

        const userCartItems = user.cart?.items.map(item => {
            const brandTranslation = item.product.brand?.translation.find(trans => trans.lang === lang) || item.product.brand?.translation.find(trans => trans.lang === "en")
            const productTranslation = item.product.translation.find(trans => trans.lang === lang) || item.product.translation.find(trans => trans.lang === "en")!

            return {
                ...item,
                product: {
                    ...item.product,
                    title: productTranslation.title,
                    brand: brandTranslation ? { name: brandTranslation.name } : null
                }
            }
        })

        const mergedCartItems = mergeCartItems(localCartItems, userCartItems || [])

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

        await setToken("accessToken", accessToken, { maxAge: ACCESS_TOKEN_EXPIRY })

        return {
            status: 200,
            message: translation.messages.auth.loggedIn
        }
    } catch {
        return {
            message: translation.messages.auth.loginFailed,
            status: 500,
            formData
        }
    }
}

export const logoutAction = async () => {

    const lang = await getLanguage()

    const translation = await getTranslation(lang)

    try {
        await clearToken("accessToken")
        return {
            status: 200,
            message: translation.messages.auth.loggedOut
        }
    }
    catch {
        return {
            status: 500,
            message: translation.messages.auth.logoutFailed
        }
    }
}