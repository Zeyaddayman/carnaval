import { CartItemWithProduct, QuantityModifiedItem } from "@/types/cart";
import { db } from "@/lib/prisma";
import { getProductLimit } from "@/utils/product";

type QuantityModifiedItems = { [id: string]: QuantityModifiedItem }

export async function modifyCartItemsQuantities(cartItems: CartItemWithProduct[]) {

    const quantityModifiedItems: QuantityModifiedItems = {}

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