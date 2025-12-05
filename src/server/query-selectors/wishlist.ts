import { Prisma } from "@/generated/prisma";
import { cardProductSelector } from "./product";

export const wishlistItemProductSelector = cardProductSelector satisfies Prisma.ProductSelect

export const wishlistItemSelector = {
    product: { select: wishlistItemProductSelector }
} satisfies Prisma.WishlistSelect