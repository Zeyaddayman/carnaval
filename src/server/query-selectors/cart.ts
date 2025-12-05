import { Prisma } from "@/generated/prisma";
import { cardProductSelector } from "./product";

export const cartItemProductSelector = cardProductSelector satisfies Prisma.ProductSelect

export const cartItemSelector = {
    id: true,
    cartId: true,
    quantity: true,
    createdAt: true,
    product: { select: cartItemProductSelector }
} satisfies Prisma.CartItemSelect