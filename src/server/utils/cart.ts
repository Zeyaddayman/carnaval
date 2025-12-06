import { CartItemWithProduct } from "@/types/cart";
import { db } from "@/utils/prisma";
import { getProductLimit } from "@/utils/product";

type QuantityModifiedItem = { [id: string]: { oldQuantity: number, newQuantity: number } }

export async function modifyCartItemsQuantities(cartItems: CartItemWithProduct[]) {

    const quantityModifiedItems: QuantityModifiedItem = {}

    const newCartItems = await Promise.all(cartItems.map(async (item) => {
    
        const limit = getProductLimit(item.product.stock, item.product.limit)

        if (item.quantity > limit && limit !== 0) {

            const newQuantity = limit

            quantityModifiedItems[item.id] = {
                oldQuantity: item.quantity,
                newQuantity
            }

            item.quantity = newQuantity

            await db.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: item.cartId,
                        productId: item.product.id
                    }
                },
                data: { quantity: newQuantity }
            })
        }

        return item
    }))

    return { newCartItems, quantityModifiedItems }
}