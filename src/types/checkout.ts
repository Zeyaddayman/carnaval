import { Prisma } from "@/generated/prisma";
import { checkoutItemSelector } from "@/server/query-selectors/checkout";

export type CheckoutItem = Prisma.CartItemGetPayload<{
    select: typeof checkoutItemSelector
}>