import { Prisma } from "@/generated/prisma"
import {  wishlistItemSelector } from "@/server/query-selectors/wishlist"
import { Prettify } from "."
import { WishlistItemProduct } from "./products"

export type wishlistItemWithProduct = Prettify<Omit<Prisma.WishlistGetPayload<{
    select: ReturnType<typeof wishlistItemSelector>
}>, "product"> & { product: WishlistItemProduct }>