import { PAYMENT_METHODS } from "@/constants/checkout";
import { Prisma } from "@/generated/prisma";
import { checkoutItemSelector } from "@/server/query-selectors/checkout";

export type CheckoutItem = Prisma.CartItemGetPayload<{
    select: typeof checkoutItemSelector
}>

export type PaymentMethod = typeof PAYMENT_METHODS[number];