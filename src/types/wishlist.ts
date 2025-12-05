import { Prisma } from "@/generated/prisma"
import { wishlistItemSelector } from "@/server/query-selectors/wishlist"

export type wishlistItemWithProduct = Prisma.CartItemGetPayload<{
    select: typeof wishlistItemSelector
}>