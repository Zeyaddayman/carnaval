import { CartItemWithProduct } from "@/types/cart"

export function getCartItemsCount(cartItems: { quantity: number }[]) {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
}

export function getCartSubtotal(
    cartItems: {
        product: { finalPrice: number },
        quantity: number
    }[]
) {
    return cartItems.reduce((acc, item) => acc + item.quantity * item.product.finalPrice, 0)
}

export function mergeCartItems(
    localCartItems: CartItemWithProduct[],
    userCartItems: CartItemWithProduct[]
){

    const mergedCartItems = []

    // add user cart items if exists
    if (userCartItems) {
        for (let i = 0; i < userCartItems.length; i++) {
            const currentItem = userCartItems[i]

            mergedCartItems.push({ productId: currentItem.product.id, quantity: currentItem.quantity, createdAt: currentItem.createdAt })
        }
    }

    // add local cart items
    for (let i = 0; i < localCartItems.length; i++) {
        const currentItem = localCartItems[i]

        const productInCart = mergedCartItems.find(item => item.productId === currentItem.product.id)

        if (productInCart) {
            productInCart.quantity = currentItem.quantity
        } else {
            mergedCartItems.push({ productId: currentItem.product.id, quantity: currentItem.quantity, createdAt: currentItem.createdAt })
        }
    }

    return mergedCartItems
}