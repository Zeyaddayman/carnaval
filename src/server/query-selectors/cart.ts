import { Prisma } from "@/generated/prisma";
import { cardProductSelector } from "./product";
import { Language } from "@/generated/prisma";

export const cartItemProductSelector = cardProductSelector

export const cartItemSelector = (lang: Language) => ({
    id: true,
    cartId: true,
    quantity: true,
    createdAt: true,
    product: { select: cartItemProductSelector(lang) }
}) satisfies Prisma.CartItemSelect