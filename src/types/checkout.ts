import { getPaymentMethods } from "@/constants/checkout";
import { Prisma, Product, ProductTranslation } from "@/generated/prisma";
import { checkoutItemSelector } from "@/server/query-selectors/checkout";
import { Prettify } from ".";

type CheckoutItemProduct = {
    title: ProductTranslation["title"],
    thumbnail: Product["thumbnail"],
    finalPrice: Product["finalPrice"]
}

export type CheckoutItem = Prettify<Omit<Prisma.CartItemGetPayload<{
    select: ReturnType<typeof checkoutItemSelector>
}>, "product"> & { product: Prettify<CheckoutItemProduct> }>

export type PaymentMethod = ReturnType<typeof getPaymentMethods>[number]
export type PaymentMethodValue = PaymentMethod["value"]