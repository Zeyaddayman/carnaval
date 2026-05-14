import { Prisma } from "@/generated/prisma";
import { cartItemSelector } from "@/server/query-selectors/cart";
import { Prettify } from ".";
import { CartItemProduct } from "./products";

export type CartItemWithProduct = Prettify<Omit<Prisma.CartItemGetPayload<{
    select: ReturnType<typeof cartItemSelector>
}>, "product"> & { product: CartItemProduct }>

export type QuantityModifiedItem = { oldQuantity: number, newQuantity: number }