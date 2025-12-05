import { Prisma } from "@/generated/prisma";
import { cartItemSelector } from "@/server/query-selectors/cart";

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
    select: typeof cartItemSelector
}>