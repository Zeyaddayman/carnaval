import { Prisma } from "@/generated/prisma";
import { cardProductSelector } from "./product";
import { Language } from "@/generated/prisma";

export const wishlistItemProductSelector = cardProductSelector

export const wishlistItemSelector = (lang: Language) => ({
    product: { select: wishlistItemProductSelector(lang) }
}) satisfies Prisma.WishlistSelect